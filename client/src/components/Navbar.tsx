import React, {
  FC,
} from 'react'
import {
  useLocation,
  useHistory,
} from 'react-router-dom'
import {
  channelState,
  channelIdState,
} from '../state/index'
import { useRecoilValue } from 'recoil'
import { Hash } from '../components/icons/hash'

import "./Navbar.scss"

const Navbar: FC = () => {
  const channels = useRecoilValue(channelIdState)

  return (
    <div id="navbar">
      {
        channels.map((id) => (
          <Channel key={id} id={id}/>
        ))
      }
    </div>
  )
}
interface ChannelState {
  id: string
}
const Channel: FC<ChannelState> = (s) => {
  const channel = useRecoilValue(channelState(s.id))
  const location = useLocation()
  const history = useHistory()

  if (channel) {
    return (
      <div className={`channel ${location.hash?.replace(/#/g, "") === channel.id ? "highlight" : ""}`} onClick={() => history.push(`#${channel.id}`)}>
        <Hash />
        <p>{channel.name}</p>
      </div>
    )
  }
}

export default Navbar
