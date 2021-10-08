import React from 'react'
import {
  channelsSelector,
} from '../state/index'
import { useLocation } from 'react-router-dom'
import { Hash } from '../components/icons/hash'
import { useRecoilValue } from 'recoil'
import ActualChannel from './ActualChannel'

import "./Channel.scss"

const NoChannel: React.FC = () => (
  <div className="nochannel">
    <div className="nochannelinner">
      <Hash />
      <h2 className="select-channel">Select a channel to begin chatting!</h2>
    </div>
  </div>
)

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
