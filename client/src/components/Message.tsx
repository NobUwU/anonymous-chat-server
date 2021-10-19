import React from 'react'
import {
  Message as RestMessage,
} from '../../../@types'
import {
  userState,
} from '../state/index'
import { useRecoilState } from 'recoil'
import { Remarkable } from 'remarkable'
import { linkify } from 'remarkable/linkify'
import hljs from 'highlight.js'
import axios from 'axios'

import "./Message.scss"

import "highlight.js/scss/github-dark.scss"

const md = new Remarkable({
  html: false,
  xhtmlOut: true,
  breaks: true,
  langPrefix: "codeylangy-",
  // linkify: true,
  linkTarget: '_blank',
  typographer: false,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value
      } catch (error) {
        console.error(error)
      }
    } else if (lang) {
      try {
        return hljs.highlightAuto(str).value
      } catch (error) {
        console.error(error)
      }
    }

    return str
  },
})

md.use(linkify)

md.block.ruler.disable(['heading', 'hr', 'list', 'footnote', 'lheading', 'table', 'deflist'])
md.inline.ruler.disable(['footnote_ref'])
md.core.ruler.disable(['footnote_tail'])

interface MessageState {
  message: RestMessage,
}
const Message: React.FC<MessageState> = (s: MessageState) => {
  const date = new Date(parseInt(s.message.date))
  const [user, setUser] = useRecoilState(userState(s.message.author))

  if (!user) setUser({
    id: s.message.author,
    username: "Unknown User",
    avatar: "/static/logo.png",
    temp: true,
  })

  React.useEffect(() => {
    console.log("message state loaded")
  }, [])

  React.useEffect(() => {
    async function attemptUser(): Promise<void> {
      try {
        const attemptUnknown = await axios.get(`/api/user?id=${s.message.author}`)
        setUser(attemptUnknown.data.user)
      } catch (error) {
        console.error(error)
      }
    }
    if (user.temp) {
      attemptUser()
    }
  }, [])

  return (
    <div id="message">
      <div className="info">
        <div className="avatar">
          <img src={user.avatar} alt={user.username} />
        </div>
        <div className="content">
          <div className="user-info">
            <h3 style={user.color ? { color: user.color } : {}}>{user.username}</h3>
            {
              user.server
                ? <div id="mini-tag" className="server">
                  <p>SERVER</p>
                </div>
                : ""
            }
            <p className="date">{date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric', 
            })} {date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute:'2-digit', 
            })}</p>
          </div>
          <div className="message" style={ s.message.failed ? { color: "#ff6969" } : {} } dangerouslySetInnerHTML={{
            __html: md.render(s.message.content), 
          }}></div>
        </div>
      </div>
    </div>
  )
}

export default Message
