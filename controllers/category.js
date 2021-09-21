const { request, response } = require('express');
const { Category } = require('../models')

//#region GET -> Paginate, total and populate (user id)
const categoriesGet = async (req = request, res = response) => {

    const { limit, from } = req.query;
    const query = { status: true }

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('user')
            .skip((Number(from) ? +from : 0))
            .limit((Number(limit) ? +limit : 20))
    ]);

    res.json({
        total,
        categories
    });
}

const categoryGet = async (req = request, res = response) => {

    const { id } = req.params;
    const category = await Category.findById(id).populate('user', 'name');

    res.json({
        category
    });
}
//#endregion

//#region POST
const categoryPost = async (req = request, res = response) => {

    const name = req.body.name.toUpperCase();
    const categoryDB = await Category.findOne({ name });
    if (categoryDB) {
        return res.status(400).json({
            msg: `La categoría ${name} ya existe`
        });
    }

    const data = {
        name,
        user: req.login._id
    }

    const category = new Category(data);
    await category.save();

    res.status(201).json({
        category
    });
};
//#endregion

//#region PUT
const categoryPut = async (req = request, res = response) => {

    const id = req.params.id;
    const { user, ...data } = req.body;
    const categoryDB = await Category.findById(id);

    data.name = (data.name) ? data.name : categoryDB.name;
    data.status = (data.status != null) ? data.status : categoryDB.status;
    data.user = req.login._id

    const category = await Category.findByIdAndUpdate(id, data, {new: true});

    res.json({
        category
    });
};
//#endregion

//#region DELETE
const categoryDelete = async (req = request, res = response) => {

    const id = req.params.id;
    const category = await Category.findByIdAndUpdate(id, {status: false}, {new: true});

    res.json({
        category
    });
};
//#endregion

module.exports = {
    categoryGet,
    categoriesGet,
    categoryPost,
    categoryPut,
    categoryDelete,
}