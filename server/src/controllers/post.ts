import { Response } from 'express';
import prisma from '../db/db';

export const postController = {
    getPost: async (req: TVerifyAccessToken, res: Response) => {
        const { all, limit, offset } = req.query;
        const skipCount = offset ? Number(offset) * Number(limit) : 0;
        const skip = skipCount <= 0 ? 0 : skipCount;

        if (!all) {
            const dataPost = await prisma.post.findMany({
                where: {
                    comment: {
                        some: {
                            createAt: {
                                lte: new Date(),
                            },
                        },
                    },
                },
                take: 10,
                skip: skip,
                include: {
                    comment: {
                        take: 1,
                        orderBy: {
                            createAt: 'desc',
                        },
                    },
                    reaction: true,
                    user: true,
                    views: true,
                    _count: true,
                },
            });
            res.status(200).json({
                count: dataPost.length,
                data: dataPost,
            });
        }
    },

    createPostController: async (req: TVerifyAccessToken, res: Response) => {
        const user = req.user?.user_name as string;
        const { ...data } = req.body;
        const result = await prisma.post.create({
            data: {
                user_name: user,
                ...data,
            },
        });
        res.status(201).json({
            message: 'Success!',
            data: result,
        });
    },
    updatePostController: async (req: TVerifyAccessToken, res: Response) => {
        const user = req.user?.user_name;
        const { id } = req.params;
        const { ...data } = req.body;

        await prisma.post.update({
            where: {
                user_name: user,
                id: id as string,
            },
            data: {
                ...data,
            },
            select: {
                id: true,
                content: true,
                img: true,
                comment: true,
            },
        });
        res.status(200).json({
            message: 'Success Change Post',
        });
    },
    deletePostController: async (req: TVerifyAccessToken, res: Response) => {
        const { id } = req.params;
        const user = req.user;
        const deleteConditions = user?.role === 'ADMIN' ? { id: id } : { user_name: user?.user_name, id: id };

        await prisma.post.delete({
            where: deleteConditions,
        });

        res.status(200).json({
            message: 'Delete Success!',
        });
    },
};
