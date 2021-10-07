import React, {
  FC,
  useState,
  useRef,
  useEffect,
} from 'react'
import {
  useLocation,
  useHistory,
} from 'react-router-dom'
import { Hash } from '../components/icons/hash'
import "./Navbar.scss"

const Navbar: FC<{ channels: string[] }> = (s: { channels: string[] }) => {
  const location = useLocation()
  const history = useHistory()

  return (
    <div id="navbar">
      {
        s.channels.map((channel, i) => (
          <div key={i} className={`channel ${location.hash?.replace(/#/g, "") === channel ? "highlight" : ""}`} onClick={() => history.push(`#${channel}`)}>
            <Hash />
            <p>{channel}</p>
          </div>
        ))
      }
    </div>
  )
}

export default Navbar
