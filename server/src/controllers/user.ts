import { Response, Request } from 'express';
import prisma from '../db/db';

export const userController = {
    getUserCurrent: async (req: Request, res: Response) => {
        try {
            const user_name = req.params.user_name;
            const dataUser = await prisma.user.findUnique({
                where: {
                    user_name: user_name,
                },
            });
            if (dataUser) {
                res.status(200).json({
                    data: dataUser,
                });
            } else {
                res.status(403).json({
                    messenger: "Haven't account !!!",
                });
            }
        } catch (err) {
            res.status(404).json({
                messenger: "You're not authorization",
            });
        }
    },

    deleteUser: async (req: Request, res: Response) => {
        const user_name = req.params.user_name;

        const userDel = await prisma.user.delete({
            where: {
                user_name: user_name,
            },
        });
        res.json({
            messenger: 'You was delete success',
            infoUser: userDel,
        });
    },
    updateUser: async (req: Request, res: Response) => {
        try {
            const { user_name } = req.params;
            const data = req.body;
            await prisma.user.update({
                where: {
                    user_name: user_name,
                },
                data: data,
            });
            res.status(201).json({
                messenger: 'Update info success !!!',
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Have wrong error',
            });
        }
    },
    addFriend: async (req: Request, res: Response) => {
        // try {
        //     const { self, reiceiver } = req.body;

        //     await prisma.user.update({
        //         where: {
        //             user_name: reiceiver,
        //         },
        //         data: {
        //             incomingFriendRequests: {
        //                 connect: {
        //                     user_name: self,
        //                 },
        //             },
        //             followed_by: {
        //                 connect: {
        //                     user_name: self,
        //                 },
        //             },
        //         },
        //     });
        //     await prisma.user.update({
        //         where: {
        //             user_name: self,
        //         },
        //         data: {
        //             outgoingFriendRequests: {
        //                 connect: {
        //                     user_name: reiceiver,
        //                 },
        //             },
        //             following: {
        //                 connect: {
        //                     user_name: reiceiver,
        //                 },
        //             },
        //         },
        //     });
        //     const listFriendSelf = await prisma.user.findFirst({
        //         where: {
        //             user_name: self,
        //         },
        //         include: {
        //             outgoingFriendRequests: true,
        //         },
        //     });
        //     res.status(200).json({
        //         messenger: 'Addfriend Success!',
        //         data: listFriendSelf,
        //     });
        // } catch (err) {
        //     console.log(err);

        //     res.status(401).json({
        //         messenger: "Can't add friend",
        //         error: err,
        //     });
        // }
    },
};
