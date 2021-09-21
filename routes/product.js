const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { JWTValidator, hasRole, fieldsValidators} = require('../middlewares');
const { checkExistingProductById, checkExistingCategoryById } = require('../helpers');
const { productGet, productsGet, productPost, productPut, productDelete, } = require('../controllers/product');

//#region Product GET - Access Token
router.get('/', [
    JWTValidator
], productsGet);

router.get('/:id', [
    JWTValidator, 
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(checkExistingProductById),
    fieldsValidators
], productGet);
//#endregion

//#region Product Post - Access Token / Admin y Mod
router.post('/', [
    JWTValidator, 
    hasRole('ADMIN_ROLE', 'MOD_ROLE'),
    check('category', 'No es un ID de categoría valido').isMongoId(),
    check('category').custom(checkExistingCategoryById),
    check('name', '¡El nombre del producto es obligatorio!').not().isEmpty(),
    check('price', '¡El precio debe ser un número!').isNumeric(),
    fieldsValidators
], productPost);
//#endregion

//#region Product PUT - Access Token / Admin y Mod
router.put('/:id', [
    JWTValidator, 
    hasRole('ADMIN_ROLE', 'MOD_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(checkExistingProductById),
    fieldsValidators
], productPut);
//#endregion

//#region Product Delete - Access Token / Admin
router.delete('/:id', [
    JWTValidator, 
    hasRole('ADMIN_ROLE', 'MOD_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(checkExistingProductById),
    fieldsValidators, 

], productDelete);
//#endregion

module.exports = router;