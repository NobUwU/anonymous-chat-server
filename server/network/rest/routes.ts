import {
  Message,
  Channel,
  User,
} from '../../../@types'
import { Router } from 'express'
import { Pr_Ipv4 } from '@animiru/singularity'
import C from '../../Constants'
const router = Router()

const singularity = new Pr_Ipv4(C.Epoch)

let channels: Channel[] = [
  {
    "index": 1,
    "name": "test-channel",
    "id": "529117321726395943",
  },
  {
    "index": 2,
    "name": "test-channel-2",
    "id": "529117493676082728",
  },
  {
    "index": 3,
    "name": "test-channel",
    "id": "529117581555140137",
  },
  {
    "index": 4,
    "name": "test-channel-5",
    "id": "529117793568818530",
  },
  {
    "index": 4,
    "name": "test-channel-5",
    "id": "529117793568418730",
  },
  {
    "index": 4,
    "name": "test-channel-5",
    "id": "529117793569818730",
  },
  {
    "index": 4,
    "name": "test-channel-5",
    "id": "529117193568818730",
  },
  {
    "index": 4,
    "name": "test-channel-5",
    "id": "529137793568818730",
  },
  {
    "index": 4,
    "name": "test-channel-5",
    "id": "529817793568818730",
  },
  {
    "index": 4,
    "name": "test-channel-5",
    "id": "529917793568818730",
  },
  {
    "index": 4,
    "name": "test-channel-5",
    "id": "529107793568818730",
  },
]
let messages: Message[] = new Array(100000)
  .fill({})
  .map((e,i) => {
    return {
      id: i.toString(),
      channel: "529117321726395943",
      author: "529205188469327361",
      message: "some super long message because i want to push this dumb shit to its limits. I feel like everything is going to die and it is going to be amazing.",
      date: Date.now() + i,
    }
  })
let users: User[] = [
  {
    id: "529205188469327361",
    avatar: "https://s167.daydaynews.cc/?url=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F11520931368%2F1000",
    username: "NobUwU",
    color: "#ff69b4",
  },
]

router.all("/", (req, res) => {
  res.status(200).json({
    status: "OK!",
  })
})

/**
 * SINGULARITIES
 */
router.get("/singularity/generate", (req, res) => {
  const sig = singularity.generate()

  res.status(200).json({
    msg: "Item successfully created!",
    singularity: {
      _: sig,
      bin: singularity.deconstruct(sig),
    },
  })
})
router.get("/singularity/deconstruct", (req, res) => {
  const sig = req.query?.singularity
  if (!sig || typeof sig !== 'string') {
    return res.status(400).json({
      msg: "Invalid Request! Missing query!",
    })
  }

  res.status(200).json({
    msg: "Item successfully deconstructed!",
    bin: singularity.deconstruct(sig),
  })
})

/**
 * CHANNEL ENDPOINTS
 */
router.get("/channels", (req, res) => {
  res.status(200).json({
    msg: "Item(s) successfully fetched!",
    channels,
  })
})

router.get("/channel", (req, res) => {
  const id = req.query?.id
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      msg: "Invalid Request! Missing query!",
    })
  }

  const channel = channels.find(i => i.id === id)
  if (!channel) {
    return res.status(404).json({
      msg: "Resource Not Found!",
    })
  }

  res.status(200).json({
    msg: "Item successfully fetched!",
    channel,
  })
})

router.post("/channel", (req, res) => {
  const index = req.body?.index
  const name = req.body?.name
  if (!name || !index) {
    return res.status(400).json({
      msg: "Invalid Request! Missing parameters!",
    })
  }

  const channel = {
    index,
    name,
    id: singularity.generate(), 
  }
  channels.push(channel)

  res.status(200).json({
    msg: "Item successfully created!",
    channel,
  })
})

router.delete("/channel", (req, res) => {
  const id = req.body?.id
  if (!id) {
    return res.status(400).json({
      msg: "Invalid Request! Missing parameters!",
    })
  }

  const channel = channels.find(i => i.id === id)
  if (!channel) {
    return res.status(404).json({
      msg: "Resource Not Found!",
    })
  }

  channels = channels.filter((i) => i.id !== id)
  res.status(200).json({
    msg: "Item successfully purged!",
    channel,
  })
})

/**
 * USER ENDPOINTS
 */
router.get("/users", (req, res) => {
  res.status(200).json({
    msg: "Item(s) successfully fetched!",
    users,
  })
})
router.get("/user", (req, res) => {
  const id = req.query?.id
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      msg: "Invalid Request! Missing query!",
    })
  }

  const user = users.find(i => i.id === id)
  if (!user) {
    return res.status(404).json({
      msg: "Resource Not Found!",
    })
  }

  res.status(200).json({
    msg: "Item successfully fetched!",
    user,
  })
})
router.post("/user", (req, res) => {
  const username = req.body?.username
  const avatar = req.body?.avatar
  if (!username || !username.length) {
    return res.status(400).json({
      msg: "Invalid Request! Missing parameters!",
    })
  }

  const user = {
    username,
    avatar: avatar || "/static/logo.png",
    color: undefined,
    id: singularity.generate(),
  }
  users.push(user)

  res.status(200).json({
    msg: "Item successfully created!",
    user,
  })
})
router.delete("/user", (req, res) => {
  const id = req.body?.id
  if (!id) {
    return res.status(400).json({
      msg: "Invalid Request! Missing parameters!",
    })
  }

  const user = users.find(i => i.id === id)
  if (!user) {
    return res.status(404).json({
      msg: "Resource Not Found!",
    })
  }

  users = users.filter((i) => i.id !== id)
  res.status(200).json({
    msg: "Item successfully purged!",
    user,
  })
})

/**
 * MESSAGE ENDPOINTS
 */
export interface RestMessage {
  id: string,
  channel: string,
  author: string,
  message: string,
  date: number
}
function sortByDate(a: RestMessage, b: RestMessage): number {
  if (a.date > b.date) {
    return -1
  }
  if (a.date < b.date) {
    return 1
  }

  return 0
}
router.get("/allmessages", (req, res) => {
  const messagez = messages.sort(sortByDate).slice(0, 50)

  res.status(200).json({
    msg: "Item(s) successfully fetched!",
    messages: messagez,
  })
})
router.get("/messages", (req, res) => {
  const channelId = req.query?.channel
  if (!channelId || typeof channelId !== 'string') {
    return res.status(400).json({
      msg: "Invalid Request! Missing query!",
    })
  }

  const channel = channels.filter(i => i.id == channelId)
  if (!channel) {
    return res.status(404).json({
      msg: "Resource Not Found!",
    })
  }

  res.status(200).json({
    msg: "Item(s) successfully fetched!",
    messages: messages.filter(i => i.channel === channelId).sort(sortByDate)
      .slice(0, 50),
  })
})
router.get("/message", (req, res) => {
  const id = req.query?.id
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      msg: "Invalid Request! Missing query!",
    })
  }

  const message = messages.find(i => i.id === id)
  if (!message) {
    return res.status(404).json({
      msg: "Resource Not Found!",
    })
  }

  res.status(200).json({
    msg: "Item successfully fetched!",
    message,
  })
})
router.post("/message", (req, res) => {
  const channelId = req.body?.channel
  const userId = req.body?.user
  const message = req.body?.message
  if (!channelId || !userId || !message || !message.length) {
    return res.status(400).json({
      msg: "Invalid Request! Missing parameters!",
    })
  }

  // return res.sendStatus(500)

  const channel = channels.filter(i => i.id == channelId)
  if (!channel) {
    return res.status(404).json({
      msg: "Resource Not Found!",
    })
  }
  
  const user = users.filter(i => i.id === userId)
  if (!user) {
    return res.status(404).json({
      msg: "Resource Not Found!",
    })
  }

  const newMessage = {
    channel: channelId,
    author: userId,
    message,
    id: singularity.generate(),
    date: Date.now(),
  }
  messages.push(newMessage)

  res.status(200).json({
    msg: "Item successfully created!",
    message: newMessage,
  })
})
router.delete("/message", (req, res) => {
  const id = req.body?.id
  if (!id) {
    return res.status(400).json({
      msg: "Invalid Request! Missing parameters!",
    })
  }

  const message = messages.find(i => i.id === id)
  if (!message) {
    return res.status(404).json({
      msg: "Resource Not Found!",
    })
  }

  messages = messages.filter((i) => i.id !== id)
  res.status(200).json({
    msg: "Item successfully purged!",
    message,
  })
})

export default router
