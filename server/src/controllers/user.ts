import { Request, Response } from 'express';
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

    isValidExistRequest: async (self: string, reiceiver: string) => {
        const isExistRequest = !!(await prisma.friendRequest.count({
            where: {
                OR: [
                    {
                        invited_name: self,
                        invition_name: reiceiver,
                    },
                    {
                        invited_name: reiceiver,
                        invition_name: self,
                    },
                ],
            },
        }));
        const areFriend = !!(await prisma.user.count({
            where: {
                user_name: self,
                friends: {
                    some: {
                        user_name: reiceiver,
                    },
                },
            },
        }));

        return isExistRequest || areFriend;
    },
    isValidAcceptRequest: async (self: string, reiceiver: string) => {
        const isSelf = !!(await prisma.friendRequest.count({
            where: {
                invition_name: reiceiver,
                invited_name: self,
            },
        }));
        return isSelf;
    },

    /**
     *   @type {ADD, ACCEPT, REJECT, DELETE}
     */

    addFriendRequest: async (req: Request, res: Response) => {
        try {
            const { self, reiceiver } = req.body;
            const isExistInListInvite = await userController.isValidExistRequest(self, reiceiver);

            if (!isExistInListInvite) {
                await prisma.$transaction([
                    prisma.user.update({
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
                                            invite_friend_status: 'PENDING',
                                        },
                                    },
                                ],
                            },
                            following: {
                                connect: [{ user_name: reiceiver }],
                            },
                        },
                    }),
                    prisma.user.update({
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
                    }),
                ]);
            } else {
                throw new Error('Request was exist !');
            }
            res.status(200).json({
                messeger: 'Send Request Success. ',
            });
        } catch (e: any) {
            res.status(403).json({
                message: e?.message,
            });
        }
    },
    acceptFriendRequest: async (req: Request, res: Response) => {
        const { self, reiceiver } = req.body;
        const isExist = await userController.isValidAcceptRequest(self, reiceiver);

        try {
            if (isExist) {
                await prisma.$transaction([
                    prisma.user.update({
                        where: {
                            user_name: self,
                        },
                        data: {
                            invited_list: {
                                upsert: [
                                    {
                                        where: {
                                            invition_name_invited_name: { invition_name: self, invited_name: reiceiver },
                                        },
                                        create: {
                                            invition_name: self,
                                            invite_friend_status: 'ACCEPT',
                                        },
                                        update: {
                                            invition_name: self,
                                            invite_friend_status: 'ACCEPT',
                                        },
                                    },
                                ],
                                deleteMany: {
                                    invition_name: self,
                                },
                            },
                            following: {
                                connect: [{ user_name: reiceiver }],
                            },
                            followed_by: {
                                connect: [{ user_name: reiceiver }],
                            },
                            friends: {
                                connect: {
                                    user_name: reiceiver,
                                },
                            },
                        },
                    }),
                    prisma.user.update({
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
                                            invite_friend_status: 'ACCEPT',
                                        },
                                        update: {
                                            invited_name: reiceiver,
                                            invite_friend_status: 'ACCEPT',
                                        },
                                    },
                                ],
                                deleteMany: {
                                    invition_name: reiceiver,
                                },
                            },
                            followed_by: {
                                connect: [{ user_name: self }],
                            },
                            following: {
                                connect: [{ user_name: self }],
                            },
                            friends: {
                                connect: {
                                    user_name: self,
                                },
                            },
                        },
                    }),
                ]);
            } else {
                throw new Error('Acceptance is not allowed or was are friends');
            }
            res.status(200).json({
                messenger: 'Add friends Success!',
            });
        } catch (e: any) {
            res.status(403).json({
                messenger: e?.message,
            });
        }
    },
    rejectFriendRequest: async (req: Request, res: Response) => {
        try {
            const { self, reiceiver } = req.body;

            await prisma.friendRequest.delete({
                where: {
                    invition_name_invited_name: {
                        invited_name: reiceiver,
                        invition_name: self,
                    },
                },
            });

            res.json({
                messenger: 'Delete success',
            });
        } catch (err) {
            res.status(403).json({
                messenger: err,
            });
        }
    },
    deleteFriendRequest: async (req: Request, res: Response) => {
        try {
            const { self, reiceiver } = req.body;
            const isExistFriend = !!(await prisma.user.count({
                where: {
                    user_name: self,
                    friends: {
                        some: {
                            user_name: reiceiver,
                        },
                    },
                },
            }));

            if (isExistFriend) {
                await prisma.$transaction([
                    prisma.user.update({
                        where: { user_name: self },
                        data: {
                            friends: { disconnect: { user_name: reiceiver } },
                            followed_by: { disconnect: { user_name: reiceiver } },
                            following: { disconnect: { user_name: reiceiver } },
                        },
                    }),
                    prisma.user.update({
                        where: { user_name: reiceiver },
                        data: {
                            friends: { disconnect: { user_name: self } },
                            followed_by: { disconnect: { user_name: self } },
                            following: { disconnect: { user_name: self } },
                        },
                    }),
                ]);
            } else {
                throw new Error('Friend are not exist !!!');
            }
            res.json({
                messeger: 'Delete Friend Success',
            });
        } catch (e: any) {
            res.status(403).json({
                messenger: e?.message,
            });
        }
    },
    /**
     * @type {GET}
     */
    getFriendOfUser: async (req: Request, res: Response) => {
        try {
            const { user_name } = req.body;
            const listFriends = await prisma.user.findFirst({
                where: {
                    user_name: user_name,
                },
                include: {
                    friends: true,
                },
            });
            res.status(200).json({
                messenger: 'OK',
                data: listFriends,
            });
        } catch (e) {
            res.status(403).json({
                messenger: e,
            });
        }
    },
    getListFriendRequest: async (req: Request, res: Response) => {
        try {
            const { user_name } = req.body;
            const listInvition = await prisma.user.findFirst({
                where: {
                    user_name: user_name,
                },
                include: {
                    invition_list: true,
                    invited_list: true,
                },
            });
            if (listInvition) {
                res.status(200).json({
                    messenger: 'OK',
                    data: listInvition,
                });
            } else {
                throw new Error('Wrong user name or not exist!');
            }
        } catch (e: any) {
            res.status(403).json({
                messenger: e.message,
            });
        }
    },
    getListFollower: async (req: Request, res: Response) => {
        try {
            const { user_name } = req.body;
            const listFollower = await prisma.user.findUnique({
                where: {
                    user_name: user_name,
                },
                include: {
                    followed_by: true,
                    following: true,
                },
            });
            if (listFollower) {
                res.status(200).json({
                    messenger: 'OK',
                    data: listFollower,
                });
            } else {
                throw new Error('User name not exist!');
            }
        } catch (e: any) {
            res.status(403).json({
                messenger: e.message,
            });
        }
    },
    getMutualFriend: async (req: Request, res: Response) => {
        try {
            const { self, others } = req.body;

            const result = await prisma.user.findMany({
                where: {
                    user_name: {
                        in: [self, others],
                    },
                },
                include: {
                    friends: true,
                },
            });
            const [user1, user2] = result;

            // filter list friend common
            const commonFriends = user1?.friends.filter(friend1 => user2?.friends.some(friend2 => friend1.user_name === friend2.user_name));

            res.status(200).json({
                messenger: 'OK',
                data: commonFriends,
            });
        } catch (e) {
            res.status(403).json({
                messenger: e,
            });
        }
    },
};
