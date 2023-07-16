const Joi = require('@hapi/joi')

const authSchema = Joi.object({
  username: Joi.string().max(20),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
})

module.exports = {
  authSchema,
}
