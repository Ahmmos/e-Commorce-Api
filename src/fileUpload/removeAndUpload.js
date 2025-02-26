
import fs from 'fs';
import path from "path";



const removeAndUpload = (fileName, req) => {
    if (fileName !== undefined) {
        // Assuming that 'path/file.txt' is a regular file.
        let filePath = (path.resolve() + fileName.split("3000")[1]).replace(/\\/g, '/')
        if (!(fs.existsSync(filePath))) {
            req.body.fileName = req.file.filename
        } else {
            fs.rmSync(filePath)
            req.body.fileName = req.file.filename
        }
    } else {
        req.body.fileName = req.file.filename
    }

    return req.body.fileName
}

const ProductRmAndUpdate = async (req, model) => {
    const product = await model.findById(req.params.id);
    if (req.files.imgCover) {

        let { imgCover } = product

        // Assuming that 'path/file.txt' is a regular file.
        if (imgCover) {
            let filePath = path.join(process.cwd(), imgCover.split("3000")[1]).replace(/\\/g, '/');
            if (fs.existsSync(filePath)) {
                fs.rmSync(filePath)
            } else {
                return req.body.imgCover = req.files.imgCover[0].filename
            }
        } else {
            return req.body.imgCover = req.files.imgCover[0].filename
        }
        req.body.imgCover = req.files.imgCover[0].filename
    }

    if (req.files.images) {
        let { images } = product

        if (images) {
            images.forEach(img => {
                const imgPath = path.join(process.cwd(), img.split("3000")[1]).replace(/\\/g, '/');
                if (fs.existsSync(imgPath)) {
                    fs.rmSync(imgPath);
                } else {
                    return req.body.images = req.files.images.map(img => img.filename);
                }
            });
        }
        return req.body.images = req.files.images.map(img => img.filename);
    }
}


const rmProductImgs = async (imgCover, images) => {
    if (imgCover) {
        let imgPath = (path.resolve() + imgCover.split("3000")[1]).replace(/\\/g, '/')
        fs.rmSync(imgPath)
    }
    if (images) {
        let imgsPaths = images.map(img => (path.resolve() + img.split("3000")[1]).replace(/\\/g, '/'))
        imgsPaths.forEach(path => fs.rmSync(path))
    }

}


export {
    removeAndUpload,
    ProductRmAndUpdate,
    rmProductImgs
}