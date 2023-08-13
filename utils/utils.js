const validator = require('validator');

const urlValidator = {
  validator: (v) => validator.isURL(v),
  message: 'Некорректный URL'
};

module.exports = { urlValidator };