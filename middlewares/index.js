const fieldsValidator = require('./fields-validator');
const jwtValidator = require('./jwt-validator');
const roleValidator = require('./roles-validator');
const uploadFileValidator = require('./file-validator')

module.exports = {
    ...fieldsValidator,
    ...jwtValidator,
    ...roleValidator,
    ...uploadFileValidator
}