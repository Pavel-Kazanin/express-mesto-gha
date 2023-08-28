const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { urlRegex } = require('./utils/constants');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  autoIndex: true,
}).then(() => console.log('connection success'));
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('*', auth, () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errors());

app.use((err, res, next) => {
  const { statusCode = 500, message } = err;

  next(res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message }));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
