const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { User, Category, Product } = require('../models')

const existingCollections = [
    'categories',
    'products',
    'roles',
    'users'
];

const categorySearch = async (term = '', res = response) => {
    const termIsMongoID = ObjectId.isValid(term);
    if (termIsMongoID) {
        const category = await Category.findById(term);
        res.json({
            results: (category) ? [category] : []
        });
    }
    // i -> Insencible a mayusculas y minusculas
    const regex = new RegExp(term, 'i');
    const category = await Category.find({ name: regex, status: true });

    res.json({
        results: category
    });
}

const productsSearch = async (term = '', res = response) => {
    const termIsMongoID = ObjectId.isValid(term);
    if (termIsMongoID) {
        const product = await Product.findById(term)
            .populate('category', 'name');
        res.json({
            results: (product) ? [product] : []
        });
    }
    // i -> Insencible a mayusculas y minusculas
    const regex = new RegExp(term, 'i');
    const product = await Product.find({ name: regex, status: true })
        .populate('category', 'name');

    res.json({
        results: product
    });
}

const userSearch = async (term = '', res = response) => {
    const termIsMongoID = ObjectId.isValid(term);
    if (termIsMongoID) {
        const user = await User.findById(term);
        res.json({
            results: (user) ? [user] : []
        });
    }
    // i -> Insencible a mayusculas y minusculas
    const regex = new RegExp(term, 'i');
    const user = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    });
    res.json({
        results: user
    });
}

const search = async (req = request, res = response) => {
    const { collection, term } = req.params;
    if (!existingCollections.includes(collection)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${existingCollections}`
        });
    }
    switch (collection) {
        case 'categories':
            categorySearch(term, res);
            break;
        case 'products':
            productsSearch(term, res);
            break;
        case 'users':
            userSearch(term, res);
            break;

        default:
            res.status(500).json({
                msg: 'Colección sin acceso añadido, consulte con el desarrollador del Backend'
            })
    }
}

module.exports = {
    search
}