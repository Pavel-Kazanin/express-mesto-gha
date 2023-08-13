const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

const getUserById = (req, res) => {
  User.findById(req.params._id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные. ${err.message}` });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: `Пользователь с id: ${req.params._id} не найден` });
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err}` });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные ${err.message}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err}` });
      }
    });
};

const editUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, returnDocument: 'after' })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные. ${err.message}` });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: `Пользователь с id: ${req.user._id} не найден` });
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err}` });
      }
    });
};

const editUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { runValidators: true, returnDocument: 'after' })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные. ${err.message}` });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: `Пользователь с id: ${req.user._id} не найден` });
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err}` });
      }
    });
};

module.exports = {
  getUsers, getUserById, createUser, editUser, editUserAvatar
};