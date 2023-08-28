const jwt = require('jsonwebtoken');
const UnauthorizeError = require('../errors/unauthorize-err');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie || !cookie.startsWith('token=')) {
    throw new UnauthorizeError('Необходима авторизация');
  }

  const token = cookie.replace('token=', '');

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnauthorizeError('Необходима авторизация');
  }

  req.user = payload;

  next();
};