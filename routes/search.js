const { Router } = require('express');
const { search } = require('../controllers/search');
const { JWTValidator } = require('../middlewares');

const router = Router();

router.get('/:collection/:term', [
    JWTValidator
], search);

module.exports = router;