import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { replaceStringNoSpace } from '../helper';
import { client } from '../db/redisdb';
import BadRequestError from '../error/BadRequestError';
import { upload } from './uploadImg';
import multer from 'multer';

export const middleware = {
    // verify AccessToken
    verifyToken: async (req: TVerifyRefreshToken, res: Response, next: NextFunction) => {
        try {
            const accessToken = req?.headers?.authorization;
            if (typeof accessToken === 'string') {
                const token = accessToken.split(' ')[1];
                jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
                    if (err) {
                        next(
                            new BadRequestError({
                                code: 401,
                                context: {
                                    message: 'You are not authoration! ',
                                },
                            })
                        );
                    }
                    req.user = user;
                    next();
                });
            } else {
                next(
                    new BadRequestError({
                        code: 400,
                        context: {
                            message: 'AccessToken not exits!',
                        },
                    })
                );
            }
        } catch (err) {
            next(err);
        }
    },
    //verifyToken and role Admin
    verifyTokenAndAdmin: (req: TVerifyAccessToken, res: Response, next: NextFunction) => {
        try {
            middleware.verifyToken(req, res, () => {
                if (req.user) {
                    if (
                        // req.user.user_name === req.params.user_name ||
                        // req.user.user_name === req.body.user_name ||
                        req.user.role === 'ADMIN' ||
                        req.user.user_name !== ''
                    ) {
                        next();
                    } else {
                        next(
                            new BadRequestError({
                                code: 401,
                                context: {
                                    messenger: "You're not allow to other",
                                },
                            })
                        );
                    }
                } else {
                    next(
                        new BadRequestError({
                            code: 401,
                            context: {
                                messenger: "You're not allow to other",
                            },
                        })
                    );
                }
            });
        } catch (err) {
            next(err);
        }
    },
    //Verify Upadte User
    verifyUpdateUser: (req: Request, res: Response, next: NextFunction) => {
        try {
            middleware.verifyTokenAndAdmin(req, res, () => {
                const data = req.body;
                for (let key in data) {
                    if (replaceStringNoSpace(data[key]) === '') {
                        next(
                            new BadRequestError({
                                code: 400,
                                context: {
                                    message: 'Request invalid data',
                                },
                            })
                        );
                    }
                }
                next();
            });
        } catch (err) {
            next(err);
        }
    },

    // Verify Refresh Token
    verifyFrefreshToken: async (req: TVerifyRefreshToken, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (refreshToken) {
                jwt.verify(refreshToken, process.env.JWT_REFESH_SECRET!, async (err: any, user: any) => {
                    if (err) {
                        next(
                            new BadRequestError({
                                code: 400,
                                context: {
                                    message: 'Refresh Token is Expred!',
                                },
                                logging: true,
                            })
                        );
                    }
                    const refreshTokenFromRedis = await client.get(`refreshToken${user?.id}`);

                    if (refreshToken === refreshTokenFromRedis) {
                        req.user = user;
                        next();
                    } else {
                        next(
                            new BadRequestError({
                                code: 400,
                                context: {
                                    message: 'Token is Expred!',
                                },
                            })
                        );
                    }
                });
            } else {
                throw new BadRequestError({
                    code: 400,
                    context: {
                        message: 'Pls login again!',
                    },
                });
            }
        } catch (err) {
            next(err);
        }
    },
    uploadz: (req: Request, res: Response, next: NextFunction) => {
        upload(req, res, function (err: any) {
            if (err instanceof multer.MulterError) {
                console.log('xfpf', err);
            } else if (err) {
                console.log('err', err);
            }

            console.log('file', req);

            next();
        });
    },
};
