
// global Joi validate function to use for validation of all things comes from user
// refactored by deepSeek 
import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/appError.js';
import { Product } from '../../database/models/products.model.js';
import { Brand } from '../../database/models/brand.model.js';
import { Category } from '../../database/models/category.model.js';

// Helper function to create folder and generate file path
const createFolderAndFilePath = (folderName, originalName) => {
    const folderPath = path.join('uploads', folderName);
    fs.mkdirSync(folderPath, { recursive: true });

    const filename = uuidv4() + '-' + slugify(originalName);
    const filePath = path.join(folderPath, filename);

    return { folderPath, filename, filePath };
};

// Helper function to save file
const saveFile = (file) => {
    fs.writeFileSync(file.path, file.buffer);
};

// Helper function to validate unique fields in the database
const validateUniqueField = async (model, field, value, errorMessage) => {
    const existingRecord = await model.findOne({ [field]: value });
    if (existingRecord) {
        throw new AppError(errorMessage, 400);
    }
};

export const validate = (schema) => {
    return async (req, res, next) => {
        const data = { ...req.body, ...req.params, ...req.query };

        try {
            if (req.files) {
                // Handle multiple files (imgCover and images)
                data.imgCover = req.files.imgCover ? req.files.imgCover[0] : null;
                data.images = req.files.images || [];

                if (!data.imgCover || !Array.isArray(data.images)) {
                    next(new AppError('Both imgCover and images are required', 400));
                }

                const { filePath: imgCoverPath, filename: imgCoverFilename, folderPath } = createFolderAndFilePath('products', data.imgCover.originalname);
                data.imgCover.path = imgCoverPath;
                data.imgCover.filename = imgCoverFilename;
                data.imgCover.destination = folderPath;

                data.images.forEach((image) => {
                    const { filePath: imagePath, filename: imageFilename } = createFolderAndFilePath('products', image.originalname);
                    image.path = imagePath;
                    image.filename = imageFilename;
                    image.destination = folderPath;
                });

            } else if (req.file) {
                // Handle single file scenarios based on fieldname
                const { fieldname, originalname } = req.file;
                const folderName = fieldname === 'image' ? 'categories' : 'brands';
                const { filePath, filename, folderPath } = createFolderAndFilePath(folderName, originalname);

                data[fieldname] = req.file;
                data[fieldname].path = filePath;
                data[fieldname].filename = filename;
                data[fieldname].destination = folderPath;
            }

            // Validate the data against the schema
            const { error } = await schema.validate(data, { abortEarly: false });

            if (error) {
                const errMsg = error.details.map(err => err.message);
                next(new AppError(errMsg, 400));
            }

            // Validate unique fields and save files
            if (data.imgCover) {
                await validateUniqueField(Product, 'title', data.title, 'Title already exists');
                saveFile(data.imgCover);
                data.images.forEach(saveFile);
            } else if (data.logo) {
                await validateUniqueField(Brand, 'name', data.name, 'Brand Name already exists');
                saveFile(data.logo);
            } else if (data.image) {
                await validateUniqueField(Category, 'name', data.name, 'Category Name already exists');
                saveFile(data.image);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};