import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import prisma from '../db/db';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generatePassword, generateRefeshToken, replaceStringNoSpace } from '../helper';
import { client } from '../db/redisdb';

export const authController = {
    verifyPassword: async (res: Response, passwordCurrent: string, passwordCheck: string) => {
        const isValidPassword = await bcrypt.compare(passwordCheck, passwordCurrent);

        if (!isValidPassword) {
            res.status(404).json({
                messenger: 'Wrong Password',
            });
        }
        return isValidPassword;
    },
    register: async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const hashed = await generatePassword(data.password);
            const dataAuth = await prisma.user.create({
                data: {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    user_name: replaceStringNoSpace(data.first_name, data.last_name, data.phone.toString().slice(-2)),
                    bithday: data.bithday,
                    gender: data.gender,
                    phone: data.phone,
                    auth: {
                        create: {
                            password: hashed,
                        },
                    },
                },
            });
            res.status(200).json({ dataAuth });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    login: async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const auth = await prisma.auth.findFirst({
                where: {
                    OR: [
                        {
                            email: data.email,
                        },
                        {
                            phone: data.phone,
                        },
                    ],
                },
            });

            if (!auth) {
                res.status(404).json({
                    messenger: 'Wrong user_name',
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
                    },
                });
                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefeshToken(user);
                await client.set(`refreshToken${user?.id}`, refreshToken, {
                    EX: Number(process.env.TIME_REFRESH_REFRESHTOKEN_NUMBER),
                    NX: true,
                });

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false, // return true when deploy
                    sameSite: 'strict',
                });
                res.status(200).json({
                    messenger: 'Login Success',
                    accessToken: accessToken,
                });
            }
        } catch (err) {
            res.status(500).json({
                message: 'Have Wrong Error!',
            });
        }
    },
    changePassword: async (req: Request, res: Response) => {
        try {
            const { password, passwordCurrent, user_name } = req.body;
            const auth = await prisma.auth.findFirst({
                where: {
                    user_name: user_name,
                },
            });
            const isValidPassword = await authController.verifyPassword(res, auth?.password!, passwordCurrent);
            if (isValidPassword && auth) {
                await prisma.auth.update({
                    where: {
                        user_name: user_name,
                    },
                    data: {
                        password: await generatePassword(password),
                    },
                });
                res.status(200).json({
                    meesenger: 'Change password success ',
                });
            } else {
                res.status(403).json({
                    messenger: 'Change password failed!',
                });
            }
        } catch (err) {
            res.status(404).json({
                messenger: 'You cant change password',
                error: err,
            });
        }
    },
    refreshToken: async (req: TVerifyRefreshToken, res: Response) => {
        const { user } = req;

        if (user) {
            const newAccessToken = generateAccessToken(user);
            res.status(200).json({
                accessToken: newAccessToken,
            });
        }
    },
    logout: async (req: TVerifyRefreshToken, res: Response) => {
        try {
            const refreshTokenId = req.user?.id;
            if (refreshTokenId) {
                await client.del(`refreshToken${refreshTokenId}`);
                res.status(200).json({
                    messenger: 'Logout success!',
                });
                res.clearCookie('refreshToken');
            }
        } catch (err) {
            res.status(404).json({
                messenger: 'Your login session has expired !',
            });
        }
    },
};
