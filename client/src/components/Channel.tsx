import React from 'react'
import {
  channelState,
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
  const value = useRecoilValue(channelState(location.hash?.replace(/#/g, "")))

  return (
    <div id="channel">
      {
        value
          ? <ActualChannel id={value.id} />
          : <NoChannel />
      }
    </div>
  )
}

export default Channel
