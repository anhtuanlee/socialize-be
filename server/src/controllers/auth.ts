import { Response, Request } from "express";
import prisma from "../db";
import jwt from "jsonwebtoken";
import { generatePassword, replaceStringNoSpace } from "../helper";
import bcrypt, { hash } from "bcrypt";
import { TUser } from "../types/global";

export const authController = {
    generateAccessToken: (user: TUser) => {
        return jwt.sign(
            { id: user!.id, userName: user!.userName, role: user!.role },
            process.env.JWT_SECRET!,
            {
                expiresIn: "2d",
            }
        );
    },
    generateRefeshToken: (user: TUser) => {
        return jwt.sign(
            { id: user!.id, userName: user!.userName, role: user!.role },
            process.env.JWT_REFESH_SECRET!,
            {
                expiresIn: "2d",
            }
        );
    },
    register: async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const hashed = await generatePassword(data.password);
            const dataAuth = await prisma.user.create({
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    userName: replaceStringNoSpace(
                        data.firstName,
                        data.lastName,
                        data.phone.toString().slice(-2)
                    ),
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
            console.log(data);
            const auth = await prisma.auth.findFirst({
                where: {
                    email: data.email,
                },
            });

            if (!auth) {
                res.status(404).json({
                    messenger: "Wrong Username",
                });
            }
            const isValidPassword = await bcrypt.compare(
                data.password,
                auth!.password
            );

            if (!isValidPassword) {
                res.status(404).json({
                    messenger: "Wrong Password",
                });
            }
            if (isValidPassword && auth) {
                const user = await prisma.user.findUnique({
                    where: { email: auth.email },
                    select: {
                        id: true,
                        role: true,
                        userName: true,
                    },
                });
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefeshToken(user);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    path: "/",
                    secure: false, // return true when deploy
                    sameSite: "strict",
                });
                res.status(200).json({
                    messenger: "Login Success",
                    accessToken: accessToken,
                });
            }
        } catch (err) {
            res.status(500).json({
                message: "Have Wrong Error!",
            });
        }
    },
    changePassword: async (req: Request, res: Response) => {
        const { password, userName } = req.body;
        await prisma.auth.update({
            where: userName,
            data: {
                password: await generatePassword(password),
            },
        });
    },
};
