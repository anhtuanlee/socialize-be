import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

const storageAvatar = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'avatar_data',
            format: 'jpeg',
            public_id: 'some_unique_id',
            limits: { fileSize: 1024 * 1024 },
        };
    },
});

const storagePosts = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'post_data',
            format: 'jpeg',
        };
    },
});
const storageComment = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'comment_data',
            format: 'jpeg',
        };
    },
});
export const uploadAvatar = multer({ storage: storageAvatar }).single('files_avatar');
export const uploadComment = multer({ storage: storageComment }).array('files_comments');
export const uploadPost = multer({ storage: storagePosts }).any();
