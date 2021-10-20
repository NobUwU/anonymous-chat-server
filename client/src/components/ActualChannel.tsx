import React from 'react'
import {
  channelState,
  currentUserState,
  messageState,
} from '../state/index'
import { useRecoilValue } from 'recoil'
import { useLocation } from 'react-router-dom'
import { Hash } from '../components/icons/hash'
import { Emoji } from '../components/icons/emoji'
import * as Helpers from '../state/helpers'
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
  const messages = useRecoilValue(messageState(s.id))
  const curUser = useRecoilValue(currentUserState)
  const addMessage = Helpers.addMessage()
  const location = useLocation()

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
        author: curUser.id,
        content: ref.current.innerText,
      })
        .then(() => {
          // addMessage(s.id, data._)
          ref.current.innerText = ""
        })
        .catch((err) => {
          console.error(err)
          addMessage(s.id, {
            id: `${Date.now()}`,
            author: curUser.id,
            channel: s.id,
            content: ref.current.innerText,
            date: String(Date.now()),
            failed: true,
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
          <div 
            id="textarea"
            ref={ref}
            contentEditable="true"
            data-placeholder={`Message #${channel.name}`}
            onKeyDown={handleKeyDown}
            onInput={handleChange}
            // Prevent Rich Pastes
            onPaste={(event) => {
              event.preventDefault()
              const text = event.clipboardData.getData('text')
              document.execCommand('insertTEXT', false, text)
            }}
          ></div>
          <div className="emoji">
            <Emoji />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActualChannel
