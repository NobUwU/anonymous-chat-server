import joi from 'joi'

export const newMessage = joi.object({
  author: joi.string()
    .required(),
  content: joi.string()
    .required(),
})
