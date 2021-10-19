import joi from 'joi'

export const newUser = joi.object({
  username: joi.string()
    .required(),
  avatar: joi.string(),
  color: joi.string(),
})
