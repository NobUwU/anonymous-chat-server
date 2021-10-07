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

const ActualChannel: React.FC<{ channel: string }> = (s: { channel: string }) => {
  const ref = React.useRef<HTMLDivElement>()

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    // console.log(event.currentTarget.innerText)
    if (!event.shiftKey && event.key.toLowerCase() === "enter") {
      event.preventDefault()
      event.stopPropagation()

      console.log([event.currentTarget.innerText])
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
        <p>beans</p>
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
