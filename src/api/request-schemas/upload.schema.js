const Joi = require('joi');

module.exports = Joi.object({
  filename: Joi.string().min(5).required()
});
