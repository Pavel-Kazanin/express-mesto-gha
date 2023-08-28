const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { emailValidator } = require('../utils/utils');
const UnauthorizeError = require('../errors/unauthorize-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [30, 'Максимальная длина поля "about" - 30'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: function(v) {
        return /^(http|https):\/\/(www.)*([a-z0-9\-]+).(ru|com|org|in|dev)([a-zA-Z0-9\-\._\/~:?#\[\]@!$&'()*+,;=])*/.test(v);
      },
      message: 'Некорректный URL'
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: emailValidator
  },
  password: {
    type: String,
    required: true,
    select: false
  }
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizeError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizeError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);