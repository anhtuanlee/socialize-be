import { Response, Request } from "express";
import prisma from "../db";
export const getCurrentUserController = (req: Request, res: Response) => {
    res.status(200).json({
        status: "success",
        currentUser: {
            id: 123,
            email: "xx@gmail.com",
        },
    });
};

export const seedUserController = async (req: Request, res: Response) => {
    await prisma.user.create({
        data: {
            fullName: "Ke thu doi",
            email: "kethudoi@gmail.com",
            userName: "kethudoi",
            phone: 123432223,
        },
    });
    res.json("Create Success");
};

export const getDataAllUserController = async (req: Request, res: Response) => {
    const dataUser = await prisma.user.findMany();
    res.status(200).json(dataUser);
};
