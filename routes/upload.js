const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidators, uploadFileValidator } = require('../middlewares');
const { JWTValidator } = require('../middlewares');
const { uploadImage, getImage, updateImageCloudinary } = require('../controllers/upload');
const { checkAllowCollections } = require('../helpers');
const router = Router();

router.post('/', [
    JWTValidator,
    uploadFileValidator
], uploadImage);

router.put('/:collection/:id', [
    JWTValidator,
    uploadFileValidator,
    check('id', 'No es un ID valido').isMongoId(),
    check('collection').custom(c => checkAllowCollections(c, ['users', 'products'])),
    fieldsValidators
], updateImageCloudinary);

router.get('/:collection/:id', [
        check('id', 'No es un ID valido').isMongoId(),
        check('collection').custom(c => checkAllowCollections(c, ['users', 'products'])),
        fieldsValidators
    ], getImage);

module.exports = router;