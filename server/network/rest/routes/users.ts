import { User } from '@types'
import { Router } from 'express'
const router = Router()

import {
  getUserById,
  getUsers,
  createUser,
  deleteUser,
  updateUserAvatar,
  updateUserColor,
  updateUserUsername,
} from '../../../services/user'
import { newUser } from '../../../validation/user'

router.get("/", (req, res) => {
  getUsers()
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
          msg: "Server error occured...",
          _: String(err),
        })
    })
})

router.post("/", (req, res) => {
  const validate = newUser.validate(req.body)
  if (validate.error) {
    return res.status(400)
      .json({
        msg: "Bad Request!",
        _: validate.error.message,
      })
  }

  createUser(validate.value.username, validate.value.avatar, validate.value.color)
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
  getUserById(req.params.id)
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

router.patch("/:id", async (req, res) => {
  const validate = newUser.validate(req.body)
  if (validate.error) {
    return res.status(400)
      .json({
        msg: "Bad Request!",
        _: validate.error.message,
      })
  }

  try {
    let user: User | undefined = undefined

    if (validate.value.username) {
      user = await updateUserUsername(req.params.id, validate.value.username)
    }
    if (validate.value.avatar) {
      user = await updateUserAvatar(req.params.id, validate.value.avatar)
    }
    if (validate.value.color) {
      user = await updateUserColor(req.params.id, validate.value.color)
    }

    return res.status(200)
      .json({
        msg: "Resource successfully updated!",
        _: user,
      })
  } catch (err) {
    console.error(err)
      
    return res.status(500)
      .json({
        msg: "Server error ocurred...",
        _: String(err),
      })
  }

})

router.delete("/:id", (req, res) => {
  deleteUser(req.params.id)
    .then((result) => {
      return res.status(200)
        .json({
          msg: "Resource successfully updated!",
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
