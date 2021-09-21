const path = require('path')
const fs = require('fs')
const { response, request } = require("express");
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);
const { uploadFile, getModelByIdAndCollection } = require('../helpers');

const uploadImage = async (req = request, res = response) => {
    try {
        //! upload text
        // const name = await uploadFile(req.files, ['text','md'], 'texts');

        // Imagenes
        const name = await uploadFile(req.files, undefined, 'images');
        res.json({
            name
        });
    } catch (error) {
        return res.status(400).json({
            error
        });
    }
}

//? Alternativa a Cloudinary (En este caso las imagenes sera subidas al repositorio del APIRest)
/* const updateImage = async (req = request, res = response) => {
    const { id, collection } = req.params;
    let model = getModelByIdAndCollection(id, collection);
    // Verificar si model.image aloja una imagen
    if (model.image) {
        // obtenemos el path de la imagen alojada en model.image
        const pathImage = path.join(__dirname, '../uploads', collection, model.image);
        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
        }
    }
    const imageName = await uploadFile(req.files, undefined, collection);
    model.image = imageName;
    await model.save();
    res.json(model);
} */

const updateImageCloudinary = async (req = request, res = response) => {

    const { id, collection } = req.params;
    let model = await getModelByIdAndCollection(id, collection);
    // Verificar si model.image aloja una imagen
    if (model.image) {
        const cutedPath = model.image.split('/');
        const fileName = cutedPath[cutedPath.length - 1].split('.')[0];
        await cloudinary.uploader.destroy(fileName);
    }
    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    model.image = secure_url;
    await model.save();
    res.json(model);
}

const getImage = async (req = request, res = response) => {

    const { id, collection } = req.params;
    const model = await getModelByIdAndCollection(id, collection);

    if (!model.image) {
        /* return res.status(500).json({
            msg: `El modelo no contiene una propiedad destinado a almacenar la dirección de una imagen`
        }); */
        res.sendFile(path.join(__dirname, '../assets', 'no-image.jpg'));
    }

    const pathImage = path.join(__dirname, '../uploads', collection, model.image);
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        res.sendFile(path.join(__dirname, '../assets', 'no-image.jpg'));
    }
}

module.exports = {
    uploadImage,
    updateImageCloudinary,
    getImage
}