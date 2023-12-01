import { Request, Response } from "express";
import prisma from "../db/db";

export const getAllPostUserController = async (req: Request, res: Response) => {
    const { user } = req.params;

    const dataPost = await prisma.post.findMany({
        where: {
            userName: user,
        },
        include: {
            comment: true,
            _count: true,
            reaction: true,
            user: true,
            views: true,
        },
    });
    res.json(dataPost);
};
