const path = require('path');
const { v4: uuidv4 } = require('uuid');
const  User  = require('../models/user');
const  Product  = require('../models/product');

const uploadFile = (files, allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {
    return new Promise((resolve, reject) => {
        const { file } = files;
        const extension = file.mimetype.split('/')[1];

        if (!allowedExtensions.includes(extension)) {
            return reject(`La extensión ${extension} no es valida, las extensiones permitidas son: ${allowedExtensions}`);
        }
        const uniqueName = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, uniqueName);
        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err)
            }
            resolve(uniqueName);
        });
    });
}

const getModelByIdAndCollection = (id, collection) => {
    return new Promise((resolve, reject) => {
        switch (collection) {
            case 'users':
                model = User.findById(id);
                if (!model) {
                    return reject(`No existe usuario con el id ${id}`);
                }
                resolve(model);
                break;
            case 'products':
                model = Product.findById(id);
                if (!model) {
                    return reject(`No existe producto con el id ${id}`);
                }
                resolve(model);
                break;
            default:
                return reject(`La colección ${collection} no esta permitida para recibir archivos`);
        }
    });
}

module.exports = {
    uploadFile,
    getModelByIdAndCollection
}