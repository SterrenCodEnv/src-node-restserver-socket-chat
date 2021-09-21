const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const {
    JWTValidator,
    hasRole,
    fieldsValidators
} = require('../middlewares');
const { isValidateRole, checkExistingEmail, checkExistingUserById } = require('../helpers');
const { userGet, userPost, userPut, userDelete } = require('../controllers/user');

//#region User GET
router.get('/', userGet);
//#endregion

//#region User Post
router.post('/',
    [
        check('name', '¡El nombre es obligatorio!').not().isEmpty(),
        check('email', '¡El correo ingresado no contiene un formato correcto!').isEmail(),
        check('email').custom(checkExistingEmail),
        check('password', '¡La contraseña debe tener mas de 6 carácteres!').isLength({
            min: 6
        }),
        //check('role', '¡No es un rol valido!').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        //check('role').custom((role) => isValidateRole(role)),
        //? Llamamos la funcion helper por referencia ya que el argumento del callback y el de la funcion son el mismo
        check('role').custom(isValidateRole),
        fieldsValidators
    ], userPost);
//#endregion

//#region User PUT
router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(checkExistingUserById),
    check('role').custom(isValidateRole),
    fieldsValidators
], userPut);
//#endregion

//#region User Delete
router.delete('/:id', [
    JWTValidator,
    //isAdminRole, // Fuerza a que el usuario logueado sea administrador
    hasRole('ADMIN_ROLE', 'MOD_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(checkExistingUserById),
    fieldsValidators
], userDelete);
//#endregion

module.exports = router;