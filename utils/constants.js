const urlRegex = /^(http|https):\/\/(www.)*([a-z0-9-.]+).(ru|com|org|in|dev|net)([a-zA-Z0-9\-._/~:?#[\]@!$&'()*+,;=])*/;
const idValidate = (schema) => schema.string().hex().alphanum().length(24);

module.exports = { urlRegex, idValidate };
