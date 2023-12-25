import prisma from '../db/db';
import { Response } from 'express';
import BadRequestError from '../error/BadRequestError';
export const reactionController = {
  getReaction: async (req: TVerifyAccessToken, res: Response) => {
    const { post_id, comment_id } = req.query;

    const result = await prisma.reaction.findMany({
      where: {
        ...(post_id && { post_id: post_id as string }),
        ...(comment_id && { comment_id: comment_id as string }),
      },
    });

    res.status(200).json({
      message: 'OK',
      data: result,
    });
  },
  createReaction: async (req: TVerifyAccessToken, res: Response) => {
    const user = req.user;
    const { type, post_id, comment_id, ...data } = req.body;

    if ((post_id && comment_id) || (!post_id && !comment_id)) {
      throw new BadRequestError({
        code: 400,
        context: {
          message: 'Just reaction with comment or post!',
        },
      });
    }

    const result = await prisma.reaction.create({
      data: {
        type: type,
        user_name: user?.user_name,
        ...(post_id ? { post_id: post_id } : {}),
        ...(comment_id ? { comment_id: comment_id } : {}),
        ...data,
      },
    });
    res.status(200).json({
      message: 'Success',
      data: result,
    });
  },
  updateReaction: async (req: TVerifyAccessToken, res: Response) => {
    try {
      const user = req.user;
      const { id, type } = req.body;
      await prisma.reaction.update({
        where: {
          user_name: user?.user_name,
          id: id,
        },
        data: {
          type: type,
        },
      });
      res.status(200).json({
        message: 'Update Success!',
      });
    } catch (err) {
      throw new BadRequestError({
        code: 401,
        context: {
          message: "You'r not authoreization!",
        },
      });
    }
  },
  deleteReaction: async (req: TVerifyAccessToken, res: Response) => {
    const user = req.user;
    const { id } = req.params;

    await prisma.reaction.delete({
      where: {
        user_name: user?.user_name,
        id: id,
      },
    });
    res.status(204).json({
      message: 'Delete reaction Success!',
    });
  },
};
