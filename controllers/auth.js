const { request, response } = require('express');
const { User } = require('../models');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers');
const { googleVerified } = require('../helpers');

const login = async (req = request, res = response) => {

    const { email, password } = req.body

    try {
        //? Verificar email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: 'El email no pertenece a un usuario registrado'
            });
        }
        //? Usuario debe estar activo
        if (user.status != true) {
            return res.status(400).json({
                msg: 'El email pertenece a un usuario dado de baja'
            });
        }
        //? Se debe verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'La constraseña ingresada no es correcta'
            });
        }

        //? Generar JWT
        const token = await generateJWT(user.id);

        res.json({
            usuario: user,
            token
        });
    } catch (error) {
        console.log(error);
        res.statsus(500).json({
            msg: 'Error al realizar la petición'
        });
    }


}

const googleSignin = async (req = request, res = response) => {

    const { id_token } = req.body;

    try {
        const { name, email, image } = await googleVerified(id_token);

        let user = await User.findOne({ email });

        // Si no existe usuario en DB con datos de Google Auth
        if (!user) {
            const data = {
                name,
                email,
                password: 'hpwSkd0XNC25uIqE5F1T',
                image,
                google: true
            }
            user = new User(data);
            await user.save();
        }

        // Si existe usuario en DB con datos de Google Auth pero su estado es false (eliminado)
        if (!user.status) {
            return res.status(401).json({
                msg: 'Acceso denegado, usuario dado de baja'
            });
        }

        // Generar Json Web Token
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Token de Google no valido'
        });
    }
}

const validateToken = async (req = request, res = response) => {
    const { login } = req;
    const token = await generateJWT(login.id);
    res.json({ login, token });
}

module.exports = {
    login,
    googleSignin,
    validateToken
}