const validator = require('validator');

const urlValidator = {
  validator: (v) => validator.isURL(v),
  message: 'Некорректный URL'
};

const emailValidator = {
  validator: (v) => validator.isEmail(v),
  message: 'Некорректный email'
};

module.exports = { urlValidator, emailValidator };