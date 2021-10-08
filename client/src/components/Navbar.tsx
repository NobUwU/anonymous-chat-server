import React, {
  FC,
} from 'react'
import {
  useLocation,
  useHistory,
} from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { channelsSelector } from '../state/index'
import { Hash } from '../components/icons/hash'

import "./Navbar.scss"

const Navbar: FC = () => {
  const channels = useRecoilValue(channelsSelector)
  const location = useLocation()
  const history = useHistory()

  return (
    <div id="navbar">
      {
        channels.map((channel) => (
          <div key={channel.id} className={`channel ${location.hash?.replace(/#/g, "") === channel.id ? "highlight" : ""}`} onClick={() => history.push(`#${channel.id}`)}>
            <Hash />
            <p>{channel.name}</p>
          </div>
        ))
      }
    </div>
  )
}

export default Navbar
