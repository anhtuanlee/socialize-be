import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const replaceStringNoSpace = (...data: any) => {
    const regexStringReplace = /\s+/g;
    let strs = '';
    data.map((str: string) => {
        return (strs += str);
    });
    return strs.replace(regexStringReplace, '').toLowerCase();
};

export const generatePassword = async (pass: string) => {
    const salt = 10;
    const password = await bcrypt.hash(pass, salt);
    return password;
};

export const generateAccessToken = (user: TUser) => {
    return jwt.sign({ id: user!.id, userName: user!.userName, role: user!.role }, process.env.JWT_SECRET!, {
        expiresIn: process.env.TIME_REFRESH_ACCESSTOKEN,
    });
};
export const generateRefeshToken = (user: TUser) => {
    return jwt.sign({ id: user!.id, userName: user!.userName, role: user!.role }, process.env.JWT_REFESH_SECRET!, {
        expiresIn: process.env.TIME_REFRESH_REFRESHTOKEN,
    });
};
