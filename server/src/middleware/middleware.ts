import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { replaceStringNoSpace } from "../helper";
import { client } from "../db/redisdb";

export const middleware = {
    // verify AccessToken
    verifyToken: async (
        req: TVerifyRefreshToken,
        res: Response,
        next: NextFunction
    ) => {
        const token = req.headers.token;
        if (typeof token === "string") {
            const accessToken = token.split(" ")[1];

            jwt.verify(
                accessToken,
                process.env.JWT_SECRET!,
                (err: any, user: any) => {
                    if (err) {
                        res.status(403).json({
                            messenger: "Token is not valid!",
                        });
                    }
                    req.user = user;
                    next();
                }
            );
        } else {
            res.status(401).json({
                messenger: "You're not authentication!",
            });
        }
    },
    //verifyToken and role Admin
    verifyTokenAndAdmin: (
        req: TVerifyAccessToken,
        res: Response,
        next: NextFunction
    ) => {
        middleware.verifyToken(req, res, () => {
            try {
                if (req.user) {
                    if (
                        req.user.user_name === req.params.user_name ||
                        req.user.role === "ADMIN"
                    ) {
                        next();
                    } else {
                        res.status(403).json({
                            messenger: "You're not allow to other",
                        });
                    }
                }
            } catch (err) {
                res.status(500).json({
                    messenger: "Have wrong error !!! ",
                });
            }
        });
    },
    //Verify Upadte User
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

    // Verify Refresh Token
    verifyFrefreshToken: (
        req: TVerifyRefreshToken,
        res: Response,
        next: NextFunction
    ) => {
        const {
            headers: { cookie },
        } = req;
        if (cookie) {
            const values = cookie.split(";").reduce(
                (res, item) => {
                    const data = item.trim().split("=");
                    return { ...res, [data[0]]: data[1] };
                },
                { refreshToken: "" }
            );
            const refreshToken: string = values?.refreshToken;
            jwt.verify(
                refreshToken,
                process.env.JWT_REFESH_SECRET!,
                async (err: any, user: any) => {
                    if (err) {
                        res.status(403).json({
                            messenger: "Token has expired !!!",
                        });
                    } else {
                        const refreshTokenFromRedis = await client.get(
                            `refreshToken${user.id}`
                        );

                        if (refreshToken === refreshTokenFromRedis) {
                            req.user = user;
                            next();
                        }
                    }
                }
            );
        }
    },
};
