const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlRegex, idValidate } = require('../utils/constants');
const {
  getUsers,
  getUserById,
  editUser,
  editUserAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:_id', celebrate({
  params: Joi.object().keys({
    _id: idValidate(Joi),
  }).unknown(true),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), editUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegex),
  }).unknown(true),
}), editUserAvatar);

module.exports = router;
