import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { replaceStringNoSpace } from "../helper";
type TGetUserAuthInfoRequest = Request & {
    user?: any;
};
export const middleware = {
    verifyToken: async (
        req: TGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) => {
        const token = req.headers.token;
        if (typeof token === "string") {
            const accessToken = token.split(" ")[1];

            jwt.verify(accessToken, process.env.JWT_SECRET!, (err, user) => {
                if (err) {
                    res.status(403).json({
                        messenger: "Token is not valid!",
                    });
                }
                req.user = user;
                next();
            });
        } else {
            res.status(401).json({
                messenger: "You're not authentication!",
            });
        }
    },
    verifyTokenAndAdmin: (
        req: TGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) => {
        middleware.verifyToken(req, res, () => {
            try {
                if (
                    req.user.userName === req.params.userName ||
                    req.user.role === "ADMIN"
                ) {
                    next();
                } else {
                    res.status(403).json({
                        messenger: "You're not allow to delete other",
                    });
                }
            } catch (err) {
                res.status(500).json({
                    messenger: "Have wrong error !!! ",
                });
            }
        });
    },
    verifyUpdateUser: (req: Request, res: Response, next: NextFunction) => {
        middleware.verifyTokenAndAdmin(req, res, () => {
            const data = req.body;
            for (let key in data) {
                if (replaceStringNoSpace(data[key]) === "") {
                    res.status(428).json({
                        messenger: "Request invalid data",
                    });
                    break;
                }
            }
            next();
        });
    },
    // verifyChangePassword: async (
    // 	req: Request,
    // 	res: Response,
    // 	next: NextFunction
    // ) => {
    // 	middleware.verifyTokenAndAdmin(req, res, next);
    // },
};
