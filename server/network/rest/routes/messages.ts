import { Router } from 'express'
const router = Router()

import {
  getMessageById,
  getMessagesByAuthor,
  getMessagesByChannel,
  createMessage,
} from '../../../services/message'
import { newMessage } from '../../../validation/message'

router.get("/:id", (req, res) => {
  getMessageById(req.params.id)
    .then((result) => {
      if (!result) return res.status(404)
        .json({
          msg: "Resource not found!",
          _: "Resource not found!",
        })

      return res.status(200)
        .json({
          msg: "Resource successfully fetched!",
          _: result,
        })
    })
    .catch((err) => {
      console.error(err)
      
      return res.status(500)
        .json({
          msg: "Server error ocurred...",
          _: String(err),
        })
    })
})
router.get("/channel/:id", (req, res) => {
  const limit = req.query.limit?.toString()
  const last = req.query.last?.toString()

  getMessagesByChannel(req.params.id, limit ? parseInt(limit) : undefined, last)
    .then((result) => {
      return res.status(200)
        .json({
          msg: "Resource successfully fetched!",
          _: result,
        })
    })
    .catch((err) => {
      console.error(err)
      
      return res.status(500)
        .json({
          msg: "Server error ocurred...",
          _: String(err),
        })
    })
})
router.post("/channel/:id", (req, res) => {
  const validate = newMessage.validate(req.body)
  if (validate.error) {
    return res.status(400)
      .json({
        msg: "Bad Request!",
        _: validate.error.message,
      })
  }

  createMessage(req.params.id, validate.value.author, validate.value.content)
    .then((result) => {
      return res.status(200)
        .json({
          msg: "Resource successfully created!",
          _: result,
        })
    })
    .catch((err) => {
      console.error(err)
      
      return res.status(500)
        .json({
          msg: "Server error ocurred...",
          _: String(err),
        })
    })
})
router.get("/author/:id", (req, res) => {
  const limit = req.query.limit?.toString()
  const last = req.query.last?.toString()

  getMessagesByAuthor(req.params.id, limit ? parseInt(limit) : undefined, last)
    .then((result) => {
      return res.status(200)
        .json({
          msg: "Resource successfully fetched!",
          _: result,
        })
    })
    .catch((err) => {
      console.error(err)
      
      return res.status(500)
        .json({
          msg: "Server error ocurred...",
          _: String(err),
        })
    })
})

export default router
