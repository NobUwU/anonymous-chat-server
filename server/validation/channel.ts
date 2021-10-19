import joi from 'joi'

export const newChannel = joi.object({
  name: joi.string()
    .required(),
  index: joi.number(),
})
