import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

const storage = new CloudinaryStorage({
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
export const upload = multer({ storage: storage }).single('avatar');
