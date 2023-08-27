const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().uri(),
  }).unknown(true),
}), createCard);
router.delete('/:_id', deleteCard);
router.put('/:_id/likes', addLike);
router.delete('/:_id/likes', deleteLike);

module.exports = router;