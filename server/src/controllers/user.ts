import { Response, Request } from 'express';
import prisma from '../db/db';
import { TypeStatusInvite } from '@prisma/client';
import { METHODS } from 'http';

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
        try {
            const { self, reiceiver, method_status } = req.body;
            if (method_status === 'PENDING') {
                // rang buco khi la ban be thi khong the ket ban them nua
                await prisma.user.update({
                    where: {
                        user_name: self,
                    },
                    data: {
                        invition_list: {
                            connectOrCreate: [
                                {
                                    where: {
                                        invition_name_invited_name: {
                                            invition_name: self,
                                            invited_name: reiceiver,
                                        },
                                    },
                                    create: {
                                        invited_name: reiceiver,
                                        invite_friend_status: method_status.toUpperCase(),
                                    },
                                },
                            ],
                        },
                        following: {
                            connect: [{ user_name: reiceiver }],
                        },
                    },
                });
                await prisma.user.update({
                    where: {
                        user_name: reiceiver,
                    },
                    data: {
                        invited_list: {
                            connect: [
                                {
                                    invition_name_invited_name: {
                                        invition_name: self,
                                        invited_name: reiceiver,
                                    },
                                },
                            ],
                        },
                    },
                });
            } else if (method_status === 'ACCEPT') {
                // rang buoc chi khi status pending moi co the ket ban
                await prisma.user.update({
                    where: {
                        user_name: self,
                    },
                    data: {
                        invited_list: {
                            upsert: [
                                {
                                    where: {
                                        invition_name_invited_name: {
                                            invition_name: self,
                                            invited_name: reiceiver,
                                        },
                                    },
                                    create: {
                                        invition_name: self,
                                        invite_friend_status: method_status.toUpperCase(),
                                    },
                                    update: {
                                        invition_name: self,
                                        invite_friend_status: method_status.toUpperCase(),
                                    },
                                },
                            ],
                            deleteMany: {
                                invition_name: self,
                            },
                        },
                        friends: {
                            connect: {
                                user_name: reiceiver,
                            },
                        },
                        following: {
                            connect: [{ user_name: reiceiver }],
                        },
                    },
                });
                await prisma.user.update({
                    where: {
                        user_name: reiceiver,
                    },
                    data: {
                        invition_list: {
                            upsert: [
                                {
                                    where: {
                                        invition_name_invited_name: {
                                            invition_name: self,
                                            invited_name: reiceiver,
                                        },
                                    },
                                    create: {
                                        invited_name: reiceiver,
                                        invite_friend_status: method_status.toUpperCase(),
                                    },
                                    update: {
                                        invited_name: reiceiver,
                                        invite_friend_status: method_status.toUpperCase(),
                                    },
                                },
                            ],
                            deleteMany: {
                                invition_name: reiceiver,
                            },
                        },
                        friends: {
                            connect: {
                                user_name: self,
                            },
                        },
                    },
                });
            } else if (method_status === 'REJECT') {
                // rang buoc khi chi co status accpet, va thu 2 la list invited co dah sach cua reiveicer
                const listInvited = await prisma.user.findFirst({
                    where: {
                        user_name: self,
                    },
                    include: {
                        invited_list: true,
                    },
                });
                const isValidFriendRequest = listInvited?.invited_list.map(item => item.invition_name === reiceiver);

                if (isValidFriendRequest) {
                    // await prisma.friend.delete({
                    //     where: {
                    //         invition_name_invited_name: {
                    //             invited_name: self,
                    //             invition_name: reiceiver,
                    //         },
                    //     },
                    // });

                    res.json({
                        messenger: 'Delete success',
                    });
                }
            } else if (method_status === 'DELETE') {
                await prisma.user.update({
                    where: {
                        user_name: self,
                    },
                    data: {
                        friends: {
                            disconnect: {
                                user_name: reiceiver,
                            },
                        },
                    },
                });
            }

            await prisma.user.update({
                where: {
                    user_name: reiceiver,
                },
                data: {
                    friends: {
                        disconnect: {
                            user_name: self,
                        },
                    },
                },
            });

            res.status(200).json({
                messger: 'DE Success',
            });
        } catch (err) {
            console.log(err);

            res.status(404).json({
                messenger: 'Addfreind Failed!',
                err: err,
            });
        }
    },
};
