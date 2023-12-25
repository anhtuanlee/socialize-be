import prisma from '../../db/db';
import { Request, Response } from 'express';
import BadRequestError from '../../error/BadRequestError';
import { userController } from './userController';
import { friendController } from './friendController';

export const followController = {
    isValidFollow: async (self: string, reiceiver: string) => {
        const result = !!(await prisma.user.findUnique({
            where: {
                user_name: self,
                following: {
                    some: {
                        user_name: reiceiver,
                    },
                },
            },
        }));
        return result;
    },
    getListFollower: async (req: TVerifyAccessToken, res: Response) => {
        const { user_name } = req.params;
        const self = req.user?.user_name;

        const listFollower = await prisma.user.findUnique({
            where: {
                user_name: user_name,
            },
            select: {
                followed_by: true,
            },
        });

        if (listFollower) {
            const newListFollowing = [];

            for (const item of listFollower.followed_by) {
                const status = await userController.getFriendshipStatus(self as string, item.user_name);
                const common_friend = await friendController.getMutualFriend(self as string, item.user_name);

                if (status.relation !== 'self') {
                    newListFollowing.push({ ...item, status, common_friend: common_friend });
                }
            }

            res.status(200).json({
                messenger: 'OK',
                data: newListFollowing,
            });
        } else {
            throw new BadRequestError();
        }
    },
    getListFollowing: async (req: TVerifyAccessToken, res: Response) => {
        const { user_name } = req.params;
        const self = req.user?.user_name;
        const listFollowing = await prisma.user.findUnique({
            where: {
                user_name: user_name,
            },
            select: {
                following: true,
            },
        });
        if (listFollowing) {
            const newListFollowing = [];

            for (const item of listFollowing.following) {
                const status = await userController.getFriendshipStatus(self as string, item.user_name);
                const common_friend = await friendController.getMutualFriend(self as string, item.user_name);
                if (status.relation !== 'self') {
                    newListFollowing.push({ ...item, status, common_friend: common_friend });
                }
            }

            res.status(200).json({
                messenger: 'OK',
                data: newListFollowing,
            });
        } else {
            throw new BadRequestError();
        }
    },
    followUser: async (req: TVerifyAccessToken, res: Response) => {
        const { self, reiceiver } = req.body;
        const isValidFollow = await followController.isValidFollow(self, reiceiver);

        if (!isValidFollow) {
            const result = await prisma.user.update({
                where: {
                    user_name: self,
                },
                data: {
                    following: {
                        connect: {
                            user_name: reiceiver,
                        },
                    },
                },
            });
            if (result) {
                res.status(200).json({
                    message: 'Follow Success!',
                });
            }
        } else {
            throw new BadRequestError({
                code: 404,
                logging: false,
                context: {
                    message: 'You was following this account!!!',
                },
            });
        }
    },
    unFollowUser: async (req: TVerifyAccessToken, res: Response) => {
        const { self, reiceiver } = req.body;
        const isValidFollow = await followController.isValidFollow(self, reiceiver);
        if (isValidFollow) {
            await prisma.user.update({
                where: {
                    user_name: self,
                },
                data: {
                    following: {
                        disconnect: {
                            user_name: reiceiver,
                        },
                    },
                },
            });
            res.status(200).json({
                message: 'Unfollow Success!',
            });
        } else {
            throw new BadRequestError({
                code: 403,
                logging: true,
                context: {
                    message: 'You not following this account!!!',
                },
            });
        }
    },
};
