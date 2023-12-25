import { Response } from 'express';
import prisma from '../db/db';
import { handleOffSetPage } from '../helper';

export const commentController = {
    getComment: async (req: TVerifyAccessToken, res: Response) => {
        const { post_id, limit, offset } = req.query;

        const { ofs, lm } = handleOffSetPage(offset as string, limit as string);
        const comments = await prisma.comments.findMany({
            where: {
                post_id: post_id as string,
                parent_id: null,
            },
            take: lm,
            skip: ofs,
        });
        res.status(200).json({
            message: 'OK',
            data: comments,
        });
    },
    createComment: async (req: TVerifyAccessToken, res: Response) => {
        const user = req.user;
        const { post_id, parent_id, ...data } = req.body;

        const result = await prisma.comments.create({
            data: {
                user_name: user!.user_name,
                post_id: post_id,
                ...(parent_id && { parent_id: parent_id }),
                ...data,
            },
        });

        if (result) {
            res.status(200).json({
                message: 'OK',
                data: result,
            });
        }
    },
    updateComment: async (req: TVerifyAccessToken, res: Response) => {
        const user = req.user;
        const { id, ...data } = req.body;
        await prisma.comments.update({
            where: {
                user_name: user?.user_name,
                id: id,
            },
            data: {
                ...data,
            },
        });
        res.status(200).json({
            message: 'Update comment Success!',
        });
    },
    deleteComment: async (req: TVerifyAccessToken, res: Response) => {
        const user = req.user;
        const { id } = req.params;

        await prisma.comments.delete({
            where: {
                id: id,
                user_name: user?.user_name,
            },
        });

        res.status(204).send({
            message: 'Delete Comment Success!',
        });
    },
};
