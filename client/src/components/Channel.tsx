import React from 'react'
import { useLocation } from 'react-router-dom'

import { Hash } from '../components/icons/hash'
import { Emoji } from '../components/icons/emoji'

import "./Channel.scss"

const NoChannel: React.FC = () => (
  <div className="nochannel">
    <div className="nochannelinner">
      <Hash />
      <h2 className="select-channel">Select a channel to begin chatting!</h2>
    </div>
  </div>
)

const Message: React.FC<{ avatar: string, username: string, date: number, color?: string, message: string }> = (s: { avatar: string, username: string, date: number, color?: string, message?: string }) => {
  const date = new Date(s.date)

  return (
    <div id="message">
      <div className="info">
        <img src={s.avatar} alt={s.username} className="avatar" />
        <div className="content">
          <div className="user-info">
            <h3 style={s.color ? { color: s.color } : {}}>{s.username}</h3>
            <p className="date">{date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric', 
            })} {date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute:'2-digit', 
            })}</p>
          </div>
          <pre className="message">{s.message}</pre>
        </div>
      </div>
    </div>
  )
}

const ActualChannel: React.FC<{ channel: string }> = (s: { channel: string }) => {
  const ref = React.useRef<HTMLDivElement>()

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    // console.log(event.currentTarget.innerText)
    if (!event.shiftKey && event.key.toLowerCase() === "enter") {
      event.preventDefault()
      event.stopPropagation()

      console.log([event.currentTarget.innerText])
      ref.current.innerText = ""
    }
  }

  function handleChange(event: React.FormEvent<HTMLDivElement>) {
    if (event.currentTarget.innerText === "\n") {
      ref.current.innerText = ""
    }
  }

  return (
    <div id="actual-channel">
      <div className="header">
        <Hash />
        <h3>{s.channel}</h3>
      </div>
      <div className="textarea">
        <Message username="Nobu" avatar="https://s167.daydaynews.cc/?url=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F11520931368%2F1000" message={`Test\nMessage`} date={Date.now()} color="#ff69b4" />
        <Message username="Nobu" avatar="https://s167.daydaynews.cc/?url=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F11520931368%2F1000" message="Test Message" date={Date.now()} color="#ff69b4" />
        <Message username="Nobu" avatar="https://s167.daydaynews.cc/?url=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F11520931368%2F1000" message="Test Message" date={Date.now()} color="#ff69b4" />
        <Message username="Nobu" avatar="https://s167.daydaynews.cc/?url=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F11520931368%2F1000" message="Test Message" date={Date.now()} color="#ff69b4" />
        <Message username="Nobu" avatar="https://s167.daydaynews.cc/?url=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F11520931368%2F1000" message="Test Message" date={Date.now()} color="#ff69b4" />
        <Message username="Nobu" avatar="https://s167.daydaynews.cc/?url=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F11520931368%2F1000" message="Test Message" date={Date.now()} color="#ff69b4" />
        <Message username="Nobu" avatar="https://s167.daydaynews.cc/?url=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F11520931368%2F1000" message="Some super long test message Some super long test message Some super long test message Some super long test message Some super long test message Some super long test message Some super long test message Some super long test message Some super long test message Some super long test message Some super long test message Some super long test message Some super long test message Some super long test message Some super long test message " date={Date.now()} color="#ff69b4" />
      </div>
      <div className="textbar">
        <div className="textbar-content">
          <div id="textarea" ref={ref} contentEditable data-placeholder={`Message #${s.channel}`} onKeyDown={handleKeyDown} onInput={handleChange}></div>
          <div className="emoji">
            <Emoji />
          </div>
        </div>
      </div>
    </div>
  )
}

const Channel: React.FC<{ channels: string[] }> = (s: { channels: string[] }) => {
  const location = useLocation()

  return (
    <div id="channel">
      {
        s.channels.includes(location.hash?.replace(/#/g, ""))
          ? <ActualChannel channel={location.hash?.replace(/#/g, "")} />
          : <NoChannel />
      }
    </div>
  )
}

export default Channel
