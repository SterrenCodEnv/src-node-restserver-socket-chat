const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const { User } = require('../models');


//#region GET
const userGet = async (req = request, res = response) => {

    const { limit, from } = req.query;
    const query = { status: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip((Number(from) ? +from : 0))
            .limit((Number(limit) ? +limit : 20))
    ]);

    res.json({
        total,
        usuarios: users
    });
}
//#endregion

//#region POST
const userPost = async (req = request, res = response) => {

    const { name, email, password, role } = req.body;
    const user = new User({
        name,
        email,
        password,
        role
    });

    //? Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    //? Guardar en DB!
    await user.save();

    res.json({
        msg: 'Post API desde Controlador',
        user
    });
};
//#endregion

//#region PUT
const userPut = async (req = request, res = response) => {

    const id = req.params.id;
    // Desestructrurar objeto para obtener propiedades a excluir de la actualzacion
    const { _id, password, correo, google, ...data } = req.body;

    // Validar datos en DB
    if (password) {
        // Encritptar nueva password
        const salt = bcryptjs.genSaltSync();
        data.password = bcryptjs.hashSync(password, salt);
    }

    const userDB = await User.findByIdAndUpdate(id, data);

    res.json({
        usuario: userDB
    });
};
//#endregion

//#region DELETE
const userDelete = async (req = request, res = response) => {

    const { id } = req.params;
    const uid = req.uid;
    const authLogin = req.login;

    //! Borrar fisicamente - Evitar (conveniente implementar estado para preservar la intregridad referencial)
    // const user = await User.findByIdAndDelete(id);

    //* Modifica status en objeto, campo de filtrado al obtener lista de usuarios
    const user = await User.findByIdAndUpdate(id, {
        status: false
    });

    res.json({
        usuario: user,
        uid_loged: uid,
        auth: authLogin
    });
};
//#endregion

module.exports = {
    userGet, 
    userPost, 
    userPut, 
    userDelete
}