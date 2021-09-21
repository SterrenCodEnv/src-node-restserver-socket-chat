const { request, response } = require('express');
const { Product } = require('../models')

//#region GET -> Paginate, total and populate (user id)
const productsGet = async (req = request, res = response) => {

    const { limit, from } = req.query;
    const query = { status: true }

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip((Number(from) ? +from : 0))
            .limit((Number(limit) ? +limit : 20))
    ]);

    res.json({
        total,
        products
    });
}

const productGet = async (req = request, res = response) => {

    const { id } = req.params;
    const product = await Product.findById(id).populate('user', ['name', 'role']).populate('category', 'name');

    res.json({
        product
    });
}
//#endregion

//#region POST
const productPost = async (req = request, res = response) => {

    const { user, status, ...data } = req.body;

    const productDB = await Product.findOne({ name: data.name });
    if (productDB) {
        return res.status(400).json({
            msg: `El producto ${data.name} ya existe`
        });
    }

    data.name = data.name.toUpperCase();
    data.user = req.login._id;

    const product = new Product(data);
    await product.save();

    res.status(201).json({
        product
    });
};
//#endregion

//#region PUT
const productPut = async (req = request, res = response) => {

    const id = req.params.id;
    const { user, ...data } = req.body;
    const productDB = await Product.findById(id);

    data.name = (data.name) ? data?.name.toUpperCase() : productDB?.name.toUpperCase();
    data.status = (data.status != null) ? data.status : productDB.status;
    data.description = (data.description) ? data.description : productDB.description;
    data.price = (data.price) ? data.price : productDB.price;
    data.category = (data.category) ? data.category : productDB.category;
    data.available = (data.available) ? data.available : productDB.available;
    data.user = req.login._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.status(201).json({
        product
    });
};
//#endregion

//#region DELETE
const productDelete = async (req = request, res = response) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, {status: false}, {new: true});
    res.json({
        product
    });
};
//#endregion

module.exports = {
    productGet,
    productsGet,
    productPost,
    productPut,
    productDelete,
}