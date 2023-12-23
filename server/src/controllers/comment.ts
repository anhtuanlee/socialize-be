import { Response } from 'express';
import { json } from 'stream/consumers';
import prisma from '../db/db';
import BadRequestError from '../error/BadRequestError';

export const commentController = {
    getAllComments: async (req: TVerifyAccessToken, res: Response) => {
        const { type, user_name, id } = req.query;
        if ((type === 'user' && user_name) || (type === 'post' && id)) {
            const dataQuery = type === 'user' ? { user_name: user_name as string } : { post_id: id as string };
            const comments = await prisma.comments.findMany({
                where: dataQuery,
            });

            res.status(200).json({
                message: 'OK',
                data: comments,
            });
        } else {
            throw new BadRequestError({
                code: 404,
                context: {
                    message: 'Data not match!',
                },
            });
        }
    },
    createComment: async (req: TVerifyAccessToken, res: Response) => {
        const user_name = req.user?.user_name;
        const { post_id, ...data } = req.body;

        const result = await prisma.comments.create({
            data: {
                user_name: user_name,
                post_id: post_id,
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
