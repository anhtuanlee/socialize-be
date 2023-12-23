import { Request, Response } from 'express';
import prisma from '../db/db';

export const postController = {
    getAllPostUserController: async (req: TVerifyAccessToken, res: Response) => {
        const user = req.user;
        const dataPost = await prisma.post.findMany({
            where: {
                user_name: user?.user_name,
            },
            include: {
                comment: true,
                reaction: true,
                user: true,
                views: true,
                _count: true,
            },
        });
        res.status(200).json(dataPost);
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
        console.log(deleteConditions);

        await prisma.post.delete({
            where: deleteConditions,
        });

        res.status(200).json({
            message: 'Delete Success!',
        });
    },
};
