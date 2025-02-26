import multer from "multer"
import { AppError } from "../utils/appError.js";


const fileUpload = () => {

    const storage = multer.memoryStorage();

    //fileFilter to control which files should be uploaded and which should be skipped.
    function fileFilter(req, file, cb) {

        if (file.mimetype.startsWith("image")) {
            // To accept the file pass `true`, like so:    
            cb(null, true);
        } else {
            // To reject this file pass `false`, like so:
            cb(new AppError("You can upload images only", 409), false);
        }
    }

    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: 8 * 1024 * 1024, // 8MB
        },
    });
};

export const uploadSingleFile = (fieldName) => fileUpload().single(fieldName);
export const uploadMixOfFiles = (arrayOfFields) => fileUpload().fields(arrayOfFields);
