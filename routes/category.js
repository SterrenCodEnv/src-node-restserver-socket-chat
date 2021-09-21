const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { JWTValidator, hasRole, fieldsValidators} = require('../middlewares');
const { checkExistingCategoryById } = require('../helpers');
const { categoryGet, categoriesGet, categoryPost, categoryPut, categoryDelete, } = require('../controllers/category');

//#region Category GET - Access Token
router.get('/', [
    JWTValidator
], categoriesGet);

router.get('/:id', [
    JWTValidator, 
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(checkExistingCategoryById),
    fieldsValidators
], categoryGet);
//#endregion

//#region Category Post - Access Token / Admin y Mod
router.post('/', [
    JWTValidator, 
    hasRole('ADMIN_ROLE', 'MOD_ROLE'),
    check('name', '¡El nombre de la categoría es obligatorio!').not().isEmpty(),
    fieldsValidators
], categoryPost);
//#endregion

//#region Category PUT - Access Token / Admin y Mod
router.put('/:id', [
    JWTValidator, 
    hasRole('ADMIN_ROLE', 'MOD_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(checkExistingCategoryById),
    fieldsValidators
], categoryPut);
//#endregion

//#region Category Delete - Access Token / Admin
router.delete('/:id', [
    JWTValidator, 
    hasRole('ADMIN_ROLE', 'MOD_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(checkExistingCategoryById),
    fieldsValidators
], categoryDelete);
//#endregion

module.exports = router;