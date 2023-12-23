import prisma from '../../db/db';
import { Request, Response } from 'express';
import BadRequestError from '../../error/BadRequestError';
import { authController } from '../auth';
import { userController } from './userController';
import { sortedDataFriend } from '../../helper/index';

export const friendController = {
    /**
     *   @type {ADD, ACCEPT, REJECT, DELETE}
     */
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
        const areFriend = !!(await prisma.friendOfUser.findFirst({
            where: {
                OR: [
                    {
                        friend_name: reiceiver,
                        user_name: self,
                    },
                    {
                        user_name: reiceiver,
                        friend_name: self,
                    },
                ],
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
    addFriendRequest: async (req: Request, res: Response) => {
        const { self, reiceiver } = req.body;
        const isExistInListInvite = await friendController.isValidExistRequest(self, reiceiver);

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
            res.status(200).json({
                messeger: 'Send Request Success. ',
            });
        } else {
            throw new BadRequestError({
                code: 400,
                context: {
                    message: 'Request was exist!',
                },
            });
        }
    },
    acceptFriendRequest: async (req: Request, res: Response) => {
        const { self, reiceiver } = req.body;
        const isExist = await friendController.isValidAcceptRequest(self, reiceiver);

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
                            connectOrCreate: {
                                where: {
                                    user_name_friend_name: {
                                        user_name: self,
                                        friend_name: reiceiver,
                                    },
                                },
                                create: {
                                    friend_name: reiceiver,
                                },
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
                            connectOrCreate: {
                                where: {
                                    user_name_friend_name: {
                                        user_name: reiceiver,
                                        friend_name: self,
                                    },
                                },
                                create: {
                                    friend_name: self,
                                },
                            },
                        },
                    },
                }),
            ]);
            res.status(200).json({
                message: 'Add friends Success!',
            });
        } else {
            throw new BadRequestError({
                code: 400,
                context: {
                    message: 'Acceptance is not allowed or was are friends!',
                },
            });
        }
    },
    rejectFriendRequest: async (req: Request, res: Response) => {
        const { self, reiceiver } = req.body;

        await prisma.friendRequest.deleteMany({
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
        });
        res.status(200).json({
            messenger: 'Reject invited success!',
        });
    },
    deleteFriendRequest: async (req: Request, res: Response) => {
        const { self, reiceiver } = req.body;
        const isExistFriend = !!(await prisma.user.count({
            where: {
                user_name: self,
                friends: {
                    some: {
                        friend_name: reiceiver,
                    },
                },
            },
        }));

        if (isExistFriend) {
            await prisma.$transaction([
                prisma.user.update({
                    where: { user_name: self },
                    data: {
                        followed_by: { disconnect: { user_name: reiceiver } },
                        following: { disconnect: { user_name: reiceiver } },
                    },
                }),
                prisma.user.update({
                    where: { user_name: reiceiver },
                    data: {
                        followed_by: { disconnect: { user_name: self } },
                        following: { disconnect: { user_name: self } },
                    },
                }),
                prisma.friendOfUser.deleteMany({
                    where: {
                        OR: [
                            {
                                user_name: reiceiver,
                                friend_name: self,
                            },
                            {
                                user_name: self,
                                friend_name: reiceiver,
                            },
                        ],
                    },
                }),
            ]);
            res.status(200).json({
                messeger: 'Delete Friend Success',
            });
        } else {
            throw new BadRequestError({
                code: 401,
                context: {
                    message: 'Friend are not exist !!!',
                },
            });
        }
    },
    /**
     * @type {GET}
     */
    getFriendOfUser: async (req: TVerifyAccessToken, res: Response) => {
        const { user_name } = req.params;

        const self = req.user?.user_name as string;
        const isValidUser = await authController.verifyUser(user_name);

        if (isValidUser) {
            const listFriends = await prisma.friendOfUser.findMany({
                where: {
                    user_name: user_name,
                    NOT: {
                        friend_name: {
                            equals: self,
                        },
                    },
                },
                select: {
                    friend: true,
                },
            });
            const dataListFriend = await Promise.all(
                listFriends.map(async item => {
                    // handle get status with ever user
                    const status = await userController.getFriendshipStatus(self, item.friend.user_name);
                    const commonFriend = await friendController.getMutualFriend(self, item.friend.user_name);

                    if (status.relation !== 'self') {
                        const newData = { ...item.friend, status: status, common_friend: commonFriend };
                        return newData;
                    }
                })
            );
            const dataFriend = sortedDataFriend(dataListFriend);
            res.status(200).json({
                messenger: 'OK',
                data: dataFriend,
            });
        } else {
            throw new BadRequestError();
        }
    },

    getListFriendRequest: async (req: Request, res: Response) => {
        const { user_name } = req.body;
        const listInvition = await prisma.user.findUnique({
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
            throw new BadRequestError();
        }
    },

    getMutualFriend: async (self: string, others: string) => {
        const commonFriends = await prisma.friendOfUser.groupBy({
            by: ['friend_name'],
            having: {
                user_name: {
                    _count: {
                        equals: 2,
                    },
                },
            },
            where: {
                OR: [{ user_name: self }, { user_name: others }],
            },
        });

        return commonFriends;
    },
};
