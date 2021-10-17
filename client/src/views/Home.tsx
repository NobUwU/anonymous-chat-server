import React, {
  FC,
  useState,
  useRef,
  useEffect,
} from 'react'
import {
  userState,
  channelState,
  messageState,
  currentUserState,
} from '../state/index'
import {
  User as RestUser,
  Message as RestMessage,
  Channel as RestChannel,
  MessageFamily,
} from '../../../@types'
import {
  useRecoilState,
  useRecoilCallback,
} from 'recoil'
import { Chevron } from '../components/icons/chevron'
import axios from 'axios'

import Loader from '../components/Loader'
import Navbar from '../components/Navbar'
import Channel from '../components/Channel'

import "./Home.scss"

const analogy = [
  "When you say 'Forward' or 'Back', your lips move in those directions.",
  "People who are goodlooking but have terrible personalities are basically real life click baits.",  
  "The Japanese flag could actually be a pie chart of how much of Japan is Japan.",
  "When you clean out a vacuum cleaner, you become a vacuum cleaner.",
  "Beef jerky is basically a meat raisin.",
  "Holes are completely empty, yet wholes are completely full.",
  "Every truck is a food truck if you're a cannibal.",
  `Why do people say "tuna fish" when they don't say "beef mammal" or "chicken bird"?`,
  "Why aren't iPhone chargers called apple juice?",
]


const Analogy: FC<{ items: string[] }> = (s: { items: string[] }) => {
  const [j, cj] = useState<string>(s.items[Math.floor(Math.random() * s.items.length)])

  const ref = useRef<HTMLDivElement>()
  useEffect(() => {
    const timeout = setTimeout(() => {
      ref.current?.classList.add("out")
      setTimeout(() => {
        const cur = s.items.indexOf(j)
        let next = s.items[cur + 1]
        if (!next) next = s.items[0]

        cj(next)
        ref.current?.classList.remove("out")
      }, 1100)
    }, 5000)

    return () => clearTimeout(timeout)
  }, [j])

  return (
    <div id="analogy">
      <p ref={ref}>{j}</p>
    </div>
  )
}

const Home: FC = () => {
  const [l, setL] = useState<boolean>(true)
  const [, setCU] = useRecoilState(currentUserState)
  const [open, setOpen] = useState<boolean>(false)
  const currentUser = localStorage.getItem("uid")

  const opener = useRef<HTMLDivElement>()
  const nav = useRef<HTMLDivElement>()
  const loading = useRef<HTMLDivElement>()
 
  const addUser = useRecoilCallback(({ set }) => (user: RestUser) => {
    set(userState(user.id), user)
  })
  const addChannel = useRecoilCallback(({ set }) => (channel: RestChannel) => {
    set(channelState(channel.id), channel)
  })
  const addMessages = useRecoilCallback(({ set }) => (messages: MessageFamily) => {
    set(messageState(messages.id), messages)
  })

  useEffect(() => {
    async function dowit() {
      await attemptLocalUser()
      const userRequest = await axios.get("/api/users")
      const users: RestUser[] = userRequest.data.users
      for (const user of users) {
        addUser(user)
      }
      const channelsRequest = await axios.get("/api/channels")
      const channels: RestChannel[] = channelsRequest.data.channels
      for (const channel of channels) {
        addChannel(channel)
        const messageRequest = await axios.get(`/api/messages?channel=${channel.id}`)
        const messages: RestMessage[] = messageRequest.data.messages
        addMessages({
          id: channel.id,
          messages, 
        })
      }
      isReady()
    }
    async function attemptLocalUser(): Promise<void> {
      if (!currentUser) {
        const newUser = await axios.post("/api/user", { username: "New User" })
        setLocalUser(newUser.data.user.id)
      } else {
        try {
          const curU = await axios.get(`/api/user?id=${currentUser}`)
          setLocalUser(curU.data.user.id)
        } catch (error) {
          console.error(error)
          const newUser = await axios.post("/api/user", { username: "New User" })
          setLocalUser(newUser.data.user.id)
        }
      }

      return
    }
    function setLocalUser(id: string): void {
      localStorage.setItem('uid', id)
      setCU(id)
    }
    function isReady() {
      setTimeout(() => {
        loading.current?.classList.add("anim-out")
        setTimeout(() => {
          setL(false)
        }, 1100)
      }, 2000)
    }

    dowit().catch(console.error)
  }, [])

  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setOpen(!open)
  }

  return (
    <div id="home">
      {
        l
          ? <div id="loading-screen" ref={loading}>
            <Loader />
            <Analogy items={analogy} />
          </div>
          : ""
      }
      <div className={`nav ${open ? "open" : ""}`} ref={nav}>
        <Navbar />
        <div className="opener" ref={opener} onClick={onClick}>
          <Chevron />
        </div>
      </div>
      <div className="channel">
        <Channel />
      </div>
    </div>
  )
}

export default Home
