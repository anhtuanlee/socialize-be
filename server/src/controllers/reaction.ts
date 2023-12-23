import prisma from '../db/db';
import { Response, Request } from 'express';
import BadRequestError from '../error/BadRequestError';
export const reactionController = {
  getReaction: async (req: TVerifyAccessToken, res: Response) => {
    const { ...data } = req.query;

    const result = await prisma.reaction.findMany({
      where: {
        ...data,
      },
    });
    res.status(200).json({
      message: 'OK',
      data: result,
    });
  },
  createReaction: async (req: TVerifyAccessToken, res: Response) => {
    const user = req.user;
    const { type, postId, commentId, ...data } = req.body;

    if ((postId && commentId) || (!postId && !commentId)) {
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
        ...(postId ? { post_id: postId } : {}),
        ...(commentId ? { comment_id: commentId } : {}),
        ...data,
      },
    });
    res.status(200).json({
      message: 'Success',
      data: result,
    });
  },
  updateReaction: async (req: TVerifyAccessToken, res: Response) => {
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
