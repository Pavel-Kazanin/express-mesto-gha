const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const CastError = require('../errors/cast-err');
const MongoServerError = require('../errors/mongo-server-err');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params._id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Переданы некорректные данные.'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(`Пользователь с id: ${req.params._id} не найден`));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Переданы некорректные данные.'));
      } else if (err.name === 'ValidationError') {
        next(new CastError(err.message));
      } else if (err.name === 'MongoServerError') {
        next(new MongoServerError(`Пользователь с email: ${email} уже существует`));
      } else {
        next(err);
      }
    });
};

const editUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, returnDocument: 'after' })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new CastError('Переданы некорректные данные.'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(`Пользователь с id: ${req.params._id} не найден`));
      } else {
        next(err);
      }
    });
};

const editUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { runValidators: true, returnDocument: 'after' })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new CastError('Переданы некорректные данные.'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(`Пользователь с id: ${req.params._id} не найден`));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true });
      res.send({ message: 'Авторизация прошла успешно' });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Переданы некорректные данные.'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(`Пользователь с id: ${req.params._id} не найден`));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers, getUserById, createUser, editUser, editUserAvatar, login, getUserInfo
};