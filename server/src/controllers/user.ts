import { Response, Request } from "express";
import prisma from "../db/db";

export const userController = {
    getUserCurrent: async (req: Request, res: Response) => {
        try {
            const userName = req.params.userName;
            const dataUser = await prisma.user.findUnique({
                where: {
                    userName: userName,
                },
            });
            if (dataUser) {
                res.status(200).json({
                    data: dataUser,
                });
            } else {
                res.status(403).json({
                    messenger: "Haven't account !!!"
                })
            }
        } catch (err) {
            res.status(404).json({
                messenger: "You're not authorization",
            });
        }
    },

    deleteUser: async (req: Request, res: Response) => {
        const userName = req.params.userName;

        const userDel = await prisma.user.delete({
            where: {
                userName: userName,
            },
        });
        res.json({
            messenger: "You was delete success",
            infoUser: userDel,
        });
    },
    updateUser: async (req: Request, res: Response) => {
        try {
            const { userName } = req.params;
            const data = req.body;
            await prisma.user.update({
                where: {
                    userName: userName,
                },
                data: data,
            });
            res.status(201).json({
                messenger: "Update info success !!!",
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Have wrong error",
            });
        }
    },
};
