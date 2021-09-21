const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWTValidator = async (req = request, res = response, next) => {

    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No existe token de autentificación'
        });
    }
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //* Crea una propiedad uid en la request y almacena el uid del token.
        req.uid = uid;

        // Obtener usuario de token y devolverlo en la request
        const loginUser = await User.findById(uid);

        if(!loginUser){
            return res.status(401).json({
                msg: 'Token no valido, el usuario no existe en DB'
            });
        }

        // Verificar que usuario contenga status true
        if(!loginUser.status){
            return res.status(401).json({
                msg: 'Token no valido, el usuario no esta autorizado a iniciar seción'
            });
        }

        req.login = loginUser;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: '¡Token no valido!'
        });
    }
}

module.exports = {
    JWTValidator
}