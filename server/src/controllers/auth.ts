import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import prisma from '../db/db';
import { client } from '../db/redisdb';
import { generateAccessToken, generatePassword, generateRefeshToken, replaceStringNoSpace } from '../helper';
import unidecode from 'unidecode';
import BadRequestError from '../error/BadRequestError';
export const authController = {
  verifyPassword: async (res: Response, passwordCurrent: string, passwordCheck: string) => {
    if (passwordCheck && passwordCurrent) {
      const isValidPassword = await bcrypt.compare(passwordCheck, passwordCurrent);

      if (!isValidPassword) {
        throw new BadRequestError({
          code: 400,
          message: 'Wrong Password!',
        });
      }
      return isValidPassword;
    }
  },
  verifyUser: async (user_name: string) => {
    const isValidUser = await prisma.auth.findFirst({
      where: {
        user_name: user_name,
      },
    });

    if (!isValidUser) {
      throw new BadRequestError({
        code: 400,
        context: {
          message: 'User are not exits!',
        },
      });
    }
    return isValidUser;
  },
  register: async (req: Request, res: Response) => {
    const data = req.body;
    if (!data)
      throw new BadRequestError({
        code: 404,
        context: {
          message: 'Access is denined!',
        },
      });

    const hashed = await generatePassword(data.password);
    const dataAuth = await prisma.user.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        full_name: `${data.first_name} ${data.last_name}`,
        email: data.email,
        user_name: unidecode(replaceStringNoSpace(data.first_name, data.last_name, data.phone.toString().slice(-2))),
        bithday: data.bithday,
        gender: data.gender,
        phone: data.phone,
        auth: {
          create: {
            password: hashed,
          },
        },
      },
      select: {
        user_name: true,
        full_name: true,
        phone: true,
        bithday: true,
        email: true,
        cover: true,
        gender: true,
        avatar: true,
        createAt: true,
      },
    });
    if (dataAuth) {
      res.status(200).json({
        message: 'Register success',
        data: dataAuth,
      });
    }
    throw new BadRequestError({
      code: 400,
      context: {
        message: 'Account was exits or phone was used!',
      },
    });
  },
  login: async (req: Request, res: Response) => {
    const data = req.body;
    const auth = await prisma.auth.findFirst({
      where: {
        OR: [
          {
            email: data.mailphone.trim(),
          },
          {
            phone: data.mailphone.trim(),
          },
        ],
      },
    });
    if (!auth) {
      throw new BadRequestError({
        code: 400,
        context: {
          message: 'Account not exits!',
        },
      });
    }
    const isValidPassword = await authController.verifyPassword(res, auth?.password!, data.password);
    if (isValidPassword && auth) {
      const user = await prisma.user.findUnique({
        where: { email: auth.email },
        select: {
          id: true,
          role: true,
          user_name: true,
          createAt: true,
        },
      });
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefeshToken(user);
      await client.del(`refreshToken${user?.id}`); // when delploy delete here
      await client.set(`refreshToken${user?.id}`, refreshToken, {
        EX: Number(process.env.TIME_REFRESH_REFRESHTOKEN_NUMBER),
        NX: true,
      }); // set to db same time with generate RT

      res.cookie('refreshToken', refreshToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + Number(process.env.TIME_REFRESH_REFRESHTOKEN_NUMBER) * 1000),
      });
      res.status(200).send({
        message: 'Login Success',
        accessToken: accessToken,
        refreshToken: refreshToken,
        data: user,
      });
    }
  },
  profile: async (req: TVerifyAccessToken, res: Response) => {
    const userLogin = req.user;
    if (userLogin) {
      const dataUser = await prisma.user.findUnique({
        where: {
          id: userLogin.id,
        },
      });
      res.json({
        message: 'OK',
        data: dataUser,
      });
    }
  },
  changePassword: async (req: Request, res: Response) => {
    const { password, passwordCurrent, user_name } = req.body;

    const isValidUser = await authController.verifyUser(user_name);
    const isValidPassword = await authController.verifyPassword(res, isValidUser?.password!, passwordCurrent);
    if (isValidPassword && isValidUser) {
      await prisma.auth.update({
        where: {
          user_name: user_name,
        },
        data: {
          password: await generatePassword(password),
        },
      });
      res.status(200).json({
        meesenger: 'Change password success',
      });
    } else {
      throw new BadRequestError({
        code: 403,
        context: {
          messenger: 'Change password failed!',
        },
      });
    }
  },
  refreshToken: async (req: TVerifyRefreshToken, res: Response) => {
    const user = req.user;

    const newAccessToken = generateAccessToken(user!);
    const newRefreshToken = generateRefeshToken(user!);

    await client.del(`refreshToken${user?.id}`);
    await client.set(`refreshToken${user?.id}`, newRefreshToken, {
      EX: Number(process.env.TIME_REFRESH_REFRESHTOKEN_NUMBER),
      NX: true,
    });

    res.cookie('refreshToken', newRefreshToken, {
      sameSite: 'lax',
      httpOnly: false,
      secure: false,
      expires: new Date(Date.now() + Number(process.env.TIME_REFRESH_REFRESHTOKEN_NUMBER) * 1000),
    });
    res.status(200).json({
      message: 'Refresh Success!',
      data: {
        accessToken: newAccessToken,
      },
    });
  },
  logout: async (req: TVerifyRefreshToken, res: Response) => {
    const refreshTokenId = req.user?.id;
    if (refreshTokenId) {
      await client.del(`refreshToken${refreshTokenId}`);
      res.clearCookie('refreshToken');
      res.status(200).json({
        messenger: 'Logout success!',
      });
    } else {
      throw new BadRequestError({
        code: 400,
        context: {
          messenger: 'Your login session has expired!',
        },
      });
    }
  },
};
