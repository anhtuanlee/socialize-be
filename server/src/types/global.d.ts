import { Request } from "express";

export type TUser = {
    id: string;
    role: "USER" | "ADMIN" | "MANAGER";
    userName: string;
    iat?: number;
    exp?: number;
} | null;
type TGetUserAuthInfoRequest = Request & {
    user?: any;
};
