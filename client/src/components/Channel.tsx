import React from 'react'
import { useLocation } from 'react-router-dom'
import { Hash } from '../components/icons/hash'
import { Emoji } from '../components/icons/emoji'
import {
  Channel as RestChannel,
  User as RestUser,
  Message as RestMessage,
} from '../types/index'
import { useRecoilValue } from 'recoil'
import {
  channelsSelector,
  messagesSelector,
  usersSelector,
} from '../state/index'
import localforage from 'localforage'


import "./Channel.scss"

const messageCache = localforage.createInstance({
  name: "message_cache",
  storeName: "message_cache", 
})


const NoChannel: React.FC = () => (
  <div className="nochannel">
    <div className="nochannelinner">
      <Hash />
      <h2 className="select-channel">Select a channel to begin chatting!</h2>
    </div>
  </div>
)

interface MessageState {
  message: RestMessage,
  user: RestUser,
}
const Message: React.FC<MessageState> = (s: MessageState) => {
  const date = new Date(s.message.date)

  return (
    <div id="message">
      <div className="info">
        <div className="avatar">
          <img src={s.user.avatar} alt={s.user.username} />
        </div>
        <div className="content">
          <div className="user-info">
            <h3 style={s.user.color ? { color: s.user.color } : {}}>{s.user.username}</h3>
            <p className="date">{date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric', 
            })} {date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute:'2-digit', 
            })}</p>
          </div>
          <div className="message">
            {s.message.message.split("\n").map((s,i) => <p key={i}>{s}</p>)}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ActualChannelState {
  channel: RestChannel
} 

const ActualChannel: React.FC<ActualChannelState> = (s: ActualChannelState) => {
  const ref = React.useRef<HTMLDivElement>()
  const location = useLocation()
  const messages = useRecoilValue(messagesSelector)
  const users = useRecoilValue(usersSelector)

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

      console.log([event.currentTarget.innerText])
      ref.current.innerText = ""
      messageCache.setItem(s.channel.id, ref.current.innerText)
    }
  }

  function handleChange(event: React.FormEvent<HTMLDivElement>) {
    if (event.currentTarget.innerText === "\n") {
      ref.current.innerText = ""
    }
    console.log("change occured")
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


const Channel: React.FC = () => {
  const location = useLocation()
  const channels = useRecoilValue(channelsSelector)

  return (
    <div id="channel">
      {
        channels.map(item => item.id).includes(location.hash?.replace(/#/g, ""))
          ? <ActualChannel channel={channels.find(i => i.id === location.hash?.replace(/#/g, ""))} />
          : <NoChannel />
      }
    </div>
  )
}

export default Channel
