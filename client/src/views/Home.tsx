import React from 'react'
import {
  MESSAGE_CREATE,
} from '../../../events'
import { loadingState } from '../state/index'
import { useRecoilValue } from 'recoil'
import { Chevron } from '../components/icons/chevron'
import { startConnection } from '../network'
import { emitter } from '../network/events'
import { Message } from '../../../@types'
import * as Helpers from '../state/helpers'
import axios from 'axios'

import Loader from '../components/Loader'
import Navbar from '../components/Navbar'
import Channel from '../components/Channel'
import Analogy from '../components/Analogy'

import "./Home.scss"

const localUserId = localStorage.getItem("uid")

const Home: React.FC = () => {
  const load = useRecoilValue(loadingState)
  const [open, setOpen] = React.useState<boolean>(false)
  const setCurrentUser = Helpers.setCurrentUser()
  const addUser = Helpers.addUser()
  const addChannel = Helpers.addChannel()
  const setMessages = Helpers.setChannelMessages()
  const addMessages = Helpers.addMessage()
  const attemptConnection = startConnection()

  const opener = React.useRef<HTMLDivElement>()
  const nav = React.useRef<HTMLDivElement>()

  React.useEffect(() => {
    async function main() {
      await attemptLocalUser()
      await fillUsers()
      await fillChannels()
      await attemptConnection()
    }

    async function fillChannels(): Promise<void> {
      const channelsRequest = await axios.get("/api/channels")
      const channels = channelsRequest.data._
      for (const channel of channels) {
        addChannel(channel)
        const messageRequest = await axios.get(`/api/messages/channel/${channel.id}`)
        const messages = messageRequest.data._
        setMessages({
          id: channel.id,
          messages,
        })
      }

      return Promise.resolve()
    }

    async function fillUsers(): Promise<void> {
      const userRequest = await axios.get("/api/users")
      const users = userRequest.data._
      for (const user of users) {
        addUser(user)
      }

      return Promise.resolve()
    }

    async function attemptLocalUser(): Promise<void> {
      if (!localUserId) {
        const newUser = await axios.post("/api/users", { username: "New User" })
        setCurrentUser(newUser.data._)
      } else {
        try {
          const curU = await axios.get(`/api/users/${localUserId}`)
          setCurrentUser(curU.data._)
        } catch (error) {
          console.error(error)
          const newUser = await axios.post("/api/users", { username: "New User" })
          setCurrentUser(newUser.data._)
        }
      }

      return
    }

    main().catch(console.error)
  }, [])

  // Websocket Connection Handler
  React.useEffect(() => {
    function onClose() {
      setTimeout(() => {
        attemptConnection().catch(console.error)
      }, 2000)
    }
    function onMessage(msg: Message) {
      addMessages(msg.channel, msg)
    }

    emitter.on('ws_closed', onClose)
    emitter.on(MESSAGE_CREATE, onMessage)

    return () => {
      emitter.removeListener('ws_closed', onClose)
      emitter.removeListener(MESSAGE_CREATE, onMessage)
    }
  }, [])

  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setOpen(!open)
  }

  return (
    <div id="home">
      {
        load
          ? <div id="loading-screen">
            <Loader />
            <Analogy />
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
