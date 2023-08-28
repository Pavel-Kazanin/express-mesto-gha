const validator = require('validator');

const emailValidator = {
  validator: (v) => validator.isEmail(v),
  message: 'Некорректный email',
};

module.exports = { emailValidator };
