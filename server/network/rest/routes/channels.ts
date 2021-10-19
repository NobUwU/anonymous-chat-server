import { Router } from 'express'
const router = Router()

import {
  createChannel,
  getChannels,
  getChannelById,
} from '../../../services/channel'
import { newChannel } from '../../../validation/channel'

router.get("/", (req, res) => {
  getChannels()
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

router.post("/", (req, res) => {
  const validate = newChannel.validate(req.body)
  if (validate.error) {
    return res.status(400)
      .json({
        msg: "Bad Request!",
        _: validate.error.message,
      })
  }
  
  createChannel(validate.value.name, validate.value.index)
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

router.get("/:id", (req, res) => {
  getChannelById(req.params.id)
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

export default router
