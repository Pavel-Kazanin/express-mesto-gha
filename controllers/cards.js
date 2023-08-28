const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const CastError = require('../errors/cast-err');
const ForbiddenError = require('../errors/forbidden-err');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CastError(err.message));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params._id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Пользователь с id: ${req.params._id} не найден`);
      }
      if (req.user._id !== card.owner.toString()) {
        throw new ForbiddenError('Нельзя удалить карточку другого пользователя');
      }

      return Card.deleteOne(card);
    })
    .then(() => res.status(200).send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

const addLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send({ data: card }))
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

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send({ data: card }))
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
  getCards, createCard, deleteCard, addLike, deleteLike,
};
