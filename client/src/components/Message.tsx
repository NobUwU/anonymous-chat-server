import React from 'react'
import {
  User as RestUser,
  Message as RestMessage,
} from '../types/index'
import { Remarkable } from 'remarkable'
import { linkify } from 'remarkable/linkify'
import hljs from 'highlight.js'
import "./Message.scss"

import "highlight.js/scss/github-dark.scss"

const md = new Remarkable({
  html: false,
  xhtmlOut: true,
  breaks: true,
  langPrefix: "codeylangy-",
  linkify: true,
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

const test = `
Normal Text
*Italic Text*
**Bold Text**
\`Inline Text\`
\`\`\`ts
const is = "codeblock"
console.log(is)
\`\`\`
https://animiru.net/
`

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
          <div className="message" dangerouslySetInnerHTML={{
            __html: md.render(test), 
          }}></div>
        </div>
      </div>
    </div>
  )
}

export default Message
