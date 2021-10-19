import { Router } from 'express'
const router = Router()

import Users from './users'
import Channels from './channels'
import Messages from './messages'

router.all("/", (_,res) => {
  res.status(200).json({
    status: "Functional",
  })
})

router.use("/users", Users)
router.use("/channels", Channels)
router.use("/messages", Messages)

export default router
