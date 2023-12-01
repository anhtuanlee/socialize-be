import { Request } from "express";

declare global {
    type TUser = {
        id: string;
        role: "USER" | "ADMIN" | "MANAGER";
        userName: string;
        iat?: number;
        exp?: number;
    } | null;
    type TVerifyAccessToken = {
        user?: TUser;
    } & Request;
    type TVerifyRefreshToken = Request & {
        user?: TUser;
    };
}
