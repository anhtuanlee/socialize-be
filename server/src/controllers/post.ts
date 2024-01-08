import { Response } from 'express';
import prisma from '../db/db';
import { handleOffSetPage, handleUpdateImg } from '../helper';
import BadRequestError from '../error/BadRequestError';
import { error } from 'console';
import cloudinary from '../config/cloudinary';
import { File } from 'buffer';
import { UploadApiResponse } from 'cloudinary';

export const postController = {
    validatePost(content: string[]) {
        const newContent = content.filter(text => text.trim() !== '');
        if (newContent.length === 0) {
            return false;
        } else {
            return true;
        }
    },

    getPost: async (req: TVerifyAccessToken, res: Response) => {
        const { all, limit, page } = req.query;
        const { ofs, lm } = handleOffSetPage(page as string, limit as string);

        if (!all) {
            const dataPost = await prisma.post.findMany({
                take: lm,
                skip: ofs,
                orderBy: {
                    createAt: 'desc',
                },
                include: {
                    comment: {
                        // take: 3,
                        orderBy: {
                            createAt: 'desc',
                        },
                        include: {
                            user: true,
                            children: {
                                include: {
                                    user: true,
                                    children: {
                                        include: {
                                            user: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    views: true,
                    user: true,
                    _count: true,
                    reaction: true,
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
        const { content, mode } = req.body;

        const isHaveContent = postController.validatePost(content);
        const files = req.files as Express.Multer.File[];
        const images = (await handleUpdateImg(files)) as string[];
        if (isHaveContent || images.length > 0) {
            const result = await prisma.post.create({
                data: {
                    user_name: user,
                    content: content,
                    img: images,
                    mode: mode,
                },
            });
            res.status(201).json({
                message: 'Success!',
                data: result,
            });
        } else {
            throw new BadRequestError({
                code: 400,
                context: {
                    message: "Post content can't empty data!",
                },
            });
        }
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
