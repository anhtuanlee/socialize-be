import { Response, Request } from "express";
import prisma from "../db";
import jwt from "jsonwebtoken";

export default async function googleLoginController(
    req: Request,
    res: Response
) {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    const token = jwt.sign({ id: user?.id }, process.env.JWT_SECRET!, {
        expiresIn: "30d",
    });
    console.log(token);
    res.status(200).json({ message: "Login success", accessToken: token });
}
