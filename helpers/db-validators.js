const Role = require('../models/role');
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');

const isValidateRole = async (role = '') => {
    const existRole = await Role.findOne({
        role
    });
    if (!existRole) {
        throw new Error(`El rol ${role} no esta registrado en la DB`);
    }
    return true;
}

const checkExistingEmail = async (email = '') => {
    const existEmail = await User.findOne({
        email
    });
    if (existEmail) {
        throw new Error(`El email ${email} ya se encuentra registrado en la DB`);
    }
    return true;
}

const checkExistingUserById = async (id) => {
    const existUser = await User.findById(id);
    if (!existUser) {
        throw new Error(`El usuario con id ${id} no se encuentra registrado en la DB`);
    }
    return true;
}

const checkExistingCategoryById = async (id) => {
    const existCategory = await Category.findById(id);
    if (!existCategory) {
        throw new Error(`La categoría con id ${id} no se encuentra registrado en la DB`);
    }
    return true;
}

const checkExistingProductById = async (id) => {
    const existProduct = await Product.findById(id);
    if (!existProduct) {
        throw new Error(`El producto con id ${id} no se encuentra registrado en la DB`);
    }
    return true;
}

const checkAllowCollections = async (collection = '', collections = []) => {
    const includeCollection = collections.includes(collection);
    if (!includeCollection) {
        throw new Error(`La colección ${collection} no es una colección permitida`);
    }
    return true;
}

module.exports = {
    isValidateRole,
    checkExistingEmail,
    checkExistingUserById,
    checkExistingCategoryById,
    checkExistingProductById,
    checkAllowCollections
}