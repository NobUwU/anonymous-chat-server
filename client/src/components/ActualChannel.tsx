import React from 'react'
import {
  channelState,
  currentUserState,
  messageState,
} from '../state/index'
import {
  useRecoilState,
  useRecoilValue,
} from 'recoil'
import { useLocation } from 'react-router-dom'
import { Hash } from '../components/icons/hash'
import { Emoji } from '../components/icons/emoji'
import Message from './Message'

import localforage from 'localforage'
const messageCache = localforage.createInstance({
  name: "message_cache",
  storeName: "message_cache", 
})

import "./ActualChannel.scss"
import axios from 'axios'

interface ActualChannelState {
  id: string
} 

const ActualChannel: React.FC<ActualChannelState> = (s: ActualChannelState) => {
  const channel = useRecoilValue(channelState(s.id))
  const [messages, setMessages] = useRecoilState(messageState(s.id))
  const curUser = useRecoilValue(currentUserState)
  const location = useLocation()
  // const [messagez, setMessages] = useRecoilState(messagesState)
  // const users = useRecoilValue(usersSelector)
  // const messages = messagez.filter(i => i.channel === s.channel.id)

  React.useEffect(() => {
    console.log("channel state loaded")
  }, [])

  const ref = React.useRef<HTMLDivElement>()
  React.useEffect(() => {
    async function getCache(): Promise<string> {
      return await messageCache.getItem(s.id)
    }
    getCache()
      .then((r) => {
        ref.current.innerText = r
      })
  }, [location])

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    // console.log(event.currentTarget.innerText)
    if (!event.shiftKey && event.key.toLowerCase() === "enter") {
      event.preventDefault()
      event.stopPropagation()

      if (!ref.current.innerText.length) return

      axios.post(`/api/messages/channel/${s.id}`, {
        author: curUser,
        content: ref.current.innerText,
      })
        .then(({ data }) => {
          setMessages({
            id: s.id,
            messages: [
              data._,
              ...messages?.messages,
            ],
          })

          ref.current.innerText = ""
        })
        .catch((err) => {
          console.error(err)

          setMessages({
            id: s.id,
            messages: [
              {
                id: `${Date.now()}`,
                author: curUser,
                channel: s.id,
                content: ref.current.innerText,
                date: String(Date.now()),
                failed: true,
              },
              ...messages?.messages,
            ],
          })

          ref.current.innerText = ""
        })

      messageCache.setItem(s.id, "")
    }
  }

  function handleChange(event: React.FormEvent<HTMLDivElement>) {
    if (event.currentTarget.innerText === "\n") {
      ref.current.innerText = ""
    }
    // console.log("change occured")
    messageCache.setItem(s.id, ref.current.innerText)
  }

  return (
    <div id="actual-channel">
      <div className="header">
        <Hash />
        <h3>{channel.name}</h3>
      </div>
      <div className="textarea">
        {
          messages?.messages
            .map((i, ind) => {
              return <Message key={i.id} message={i} />
            })
        }
      </div>
      <div className="textbar">
        <div className="textbar-content">
          <div id="textarea" ref={ref} contentEditable data-placeholder={`Message #${channel.name}`} onKeyDown={handleKeyDown} onInput={handleChange}></div>
          <div className="emoji">
            <Emoji />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActualChannel
