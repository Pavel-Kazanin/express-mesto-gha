const validator = require('validator');

const urlValidator = {
  validator: (v) => { /^(http|https):\/\/(www.)*([a-z0-9-]+).*(ru|com|org|in)([a-zA-Z0-9-._\/~:?#\[\]@!$&'\(\)\*\+,;=])*/gm.test(v); },
  message: 'Некорректный URL'
};

const emailValidator = {
  validator: (v) => validator.isEmail(v),
  message: 'Некорректный email'
};

module.exports = { urlValidator, emailValidator };