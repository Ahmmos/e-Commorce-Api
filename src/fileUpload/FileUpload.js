import multer from "multer"
import { v4 as uuidv4 } from 'uuid';
import { AppError } from "../utils/appError.js";


// dont forget to create folder called "uploads" and to use ==> app.use(static())
// main function to upload file

const fileUpload = (folderName) => {
    // disk storage gives you full control of the file you upload 
    // there is something called memoryStorage for store in memory  

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // null represent the error 
            cb(null, `uploads/${folderName}`)
        },

        filename: (req, file, cb) => {
            cb(null, uuidv4() + "_" + file.originalname)
        }
    })

    //fileFilter to control which files should be uploaded and which should be skipped.
    function fileFilter(req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            // To accept the file pass `true`, like so:        
            cb(null, true)
        } else {
            // To reject this file pass `false`, like so:
            cb(new AppError("you can upload images only", 409), false)
        }
    }
    const upload = multer({
        storage, fileFilter, limits: {
            fileSize: 8 * 1024 * 1024 //4MB
        }
    })
    return upload
}


// upload sinle files
export const uploadSingleFile = (fieldName, folderName) => fileUpload(folderName).single(fieldName)

//  uppload array of files 
export const uploadMixOfFiles = (arrayOfFields, folderName) => fileUpload(folderName).fields(arrayOfFields)