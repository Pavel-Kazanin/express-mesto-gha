const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные. ${err.message}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err}` });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: `Карточка с id: ${req.params._id} не найдена` });
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err}` });
      }
    });
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(req.params._id, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные. ${err.message}` });
      } else if (err.name === 'CastError') {
        res.status(404).send({ message: `Карточка с id: ${req.user._id} не найдена` });
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err}` });
      }
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params._id, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные. ${err.message}` });
      } else if (err.name === 'CastError') {
        res.status(404).send({ message: `Карточка с id: ${req.user._id} не найдена` });
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err}` });
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, addLike, deleteLike
};