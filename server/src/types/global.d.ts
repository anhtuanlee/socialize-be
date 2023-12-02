import { Request } from "express";

declare global {
    type TUser = {
        id: string;
        role: "USER" | "ADMIN" | "MANAGER";
        user_name: string;
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
