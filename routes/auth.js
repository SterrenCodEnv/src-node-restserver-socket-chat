const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin, validateToken } = require('../controllers/auth');
const { fieldsValidators, JWTValidator } = require('../middlewares');
const router = Router();

router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    fieldsValidators
], login);

router.post('/google', [
    check('id_token', 'Google token es necesario').not().isEmpty(),
    fieldsValidators
], googleSignin);

router.get('/', JWTValidator, validateToken);

module.exports = router;