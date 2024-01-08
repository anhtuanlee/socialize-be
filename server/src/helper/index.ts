import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

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
    return jwt.sign({ id: user!.id, user_name: user!.user_name, role: user!.role }, process.env.JWT_SECRET!, {
        expiresIn: process.env.TIME_REFRESH_ACCESSTOKEN,
    });
};
export const generateRefeshToken = (user: TUser) => {
    return jwt.sign({ id: user!.id, user_name: user!.user_name, role: user!.role }, process.env.JWT_REFESH_SECRET!, {
        expiresIn: process.env.TIME_REFRESH_REFRESHTOKEN,
    });
};
type TCommonFriend = {
    common_friend: string[];
};
export const sortedDataFriend = (data: any) => {
    const sortData = data.sort((a: TCommonFriend, b: TCommonFriend) => b.common_friend.length - a.common_friend.length);
    return sortData;
};

export const handleOffSetPage = (offset?: string, limit?: string) => {
    const newOffset = Number(offset) === 0 ? 0 : Number(offset) * Number(limit);
    return {
        ofs: newOffset,
        lm: Number(limit),
    };
};
export const handleUpdateImg = async (images: Express.Multer.File[]): Promise<string[]> => {
    const uploadImages = [];

    for (let image of images) {
        uploadImages.push(image.path);
    }
    return uploadImages;
};
