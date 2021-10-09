import React from 'react'
import {
  Channel as RestChannel,
  Message as RestMessage,
} from '../types/index'
import {
  usersSelector,
  messagesState,
  currentUserSelector,
} from '../state/index'
import {
  useRecoilValue,
  useRecoilState,
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
  channel: RestChannel
} 

const ActualChannel: React.FC<ActualChannelState> = (s: ActualChannelState) => {
  const ref = React.useRef<HTMLDivElement>()
  const location = useLocation()
  const [messages, setMessages] = useRecoilState(messagesState)
  const users = useRecoilValue(usersSelector)
  const curUser = useRecoilValue(currentUserSelector)

  React.useEffect(() => {
    async function getCache(): Promise<string> {
      return await messageCache.getItem(s.channel.id)
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

      axios.post('/api/message', {
        channel: s.channel.id,
        user: curUser,
        message: ref.current.innerText,
      })
        .then(({ data }) => {
          setMessages([...messages, data.message])
        })
        .catch(console.error)

      ref.current.innerText = ""
      messageCache.setItem(s.channel.id, ref.current.innerText)
    }
  }

  function handleChange(event: React.FormEvent<HTMLDivElement>) {
    if (event.currentTarget.innerText === "\n") {
      ref.current.innerText = ""
    }
    // console.log("change occured")
    messageCache.setItem(s.channel.id, ref.current.innerText)
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

  return (
    <div id="actual-channel">
      <div className="header">
        <Hash />
        <h3>{s.channel.name}</h3>
      </div>
      <div className="textarea">
        {
          messages
            .filter(i => i.channel === s.channel.id)
            .sort(sortByDate)
            .map((i, ind) => {
              let user = users.find(it => it.id === i.author)
              if (!user) user = {
                id: `${ind}${Date.now()}`,
                avatar: "/static/logo.png",
                username: `Unknown_User-${Math.floor(Math.random() * 9999)}`, 
              }

              return <Message key={i.id} message={i} user={user} />
            })
        }
      </div>
      <div className="textbar">
        <div className="textbar-content">
          <div id="textarea" ref={ref} contentEditable data-placeholder={`Message #${s.channel.name}`} onKeyDown={handleKeyDown} onInput={handleChange}></div>
          <div className="emoji">
            <Emoji />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActualChannel
