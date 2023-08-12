const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:_id', deleteCard);
router.put('/:_id/likes', addLike);
router.delete('/:_id/likes', deleteLike);

module.exports = router;