const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlRegex, idValidate } = require('../utils/constants');
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegex),
  }).unknown(true),
}), createCard);
router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: idValidate(Joi),
  }).unknown(true),
}), deleteCard);
router.put('/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: idValidate(Joi),
  }).unknown(true),
}), addLike);
router.delete('/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: idValidate(Joi),
  }).unknown(true),
}), deleteLike);

module.exports = router;
