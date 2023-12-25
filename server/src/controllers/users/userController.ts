import prisma from '../../db/db';
import { Request, Response } from 'express';
import BadRequestError from '../../error/BadRequestError';

export const userController = {
    async getFriendshipStatus(self: string, user_name: string) {
        let follow = false;
        if (user_name === self) {
            return {
                relation: 'self',
            };
        }
        const isFriend = await prisma.user.findFirst({
            where: {
                user_name: self,
                friends: {
                    some: {
                        user_name: self,
                        friend_name: user_name,
                    },
                },
            },
        });

        if (isFriend) {
            follow = await userController.getFriendFollowerStatus(self, user_name);

            return {
                relation: 'friend',
                follow: follow,
            };
        }

        const hasPendingInvitation = await prisma.user.findFirst({
            where: {
                user_name: self,
                invition_list: {
                    some: {
                        invited_name: user_name,
                        invition_name: self,
                    },
                },
            },
        });

        if (hasPendingInvitation) {
            return {
                relation: 'pending',
                follow: follow,
            };
        }

        const hasRejectedInvitation = await prisma.user.findUnique({
            where: {
                user_name: self,
                invited_list: {
                    some: {
                        invited_name: self,
                        invition_name: user_name,
                    },
                },
            },
        });

        if (hasRejectedInvitation) {
            return {
                relation: 'reject',
                follow: follow,
            };
        }

        return {
            relation: 'stranger',
            follow: follow,
        };
    },
    async getFriendFollowerStatus(self: string, user_name: string) {
        const statusFollow = !!(await prisma.user.findUnique({
            where: {
                user_name: self,
                following: {
                    some: {
                        user_name: {
                            equals: user_name,
                        },
                    },
                },
            },
        }));
        return statusFollow;
    },
    getUserCurrent: async (req: TVerifyRefreshToken, res: Response) => {
        const user_name = req.params.user;
        const self = req.user?.user_name as string;
        let status = await userController.getFriendshipStatus(self, user_name);
        let dataUser = await prisma.user.findUnique({
            where: {
                user_name: user_name,
            },
        });

        if (dataUser) {
            const data = { ...dataUser, status };
            res.status(200).json({
                data: data,
            });
        } else {
            throw new BadRequestError();
        }
    },
    deleteUser: async (req: Request, res: Response) => {
        const user_name = req.params.user_name;
        const userDel = await prisma.user.delete({
            where: {
                user_name: user_name,
            },
        });
        res.status(204).json({
            messenger: 'You was delete success',
            infoUser: userDel,
        });
    },
    updateUser: async (req: Request, res: Response) => {
        const { user } = req.params;
        const data = req.body;
        const test = await prisma.user.update({
            where: {
                user_name: user,
            },
            data: data,
        });
        res.status(201).json({
            messenger: 'Update info success !!!',
        });
        if (!test) {
            throw new BadRequestError();
        }
    },
};
