import React, {
  FC,
  useState,
  useRef,
} from 'react'

import "./Home.scss"

const Loader: FC = () => {
  return (
    <div id="loader">
      <div className="l-bar l-bar1"></div>
      <div className="l-bar l-bar2"></div>
      <div className="l-bar l-bar3"></div>
      <div className="l-bar l-bar4"></div>
      <div className="l-bar l-bar5"></div>
      <div className="l-bar l-bar6"></div>
      <div className="l-bar l-bar7"></div>
      <div className="l-bar l-bar8"></div>
      <div className="l-bar l-bar9"></div>
      <div className="l-bar l-bar10"></div>
    </div>
  )
}

const Home: FC = () => {
  const [l, setL] = useState<boolean>(true)

  const loading = useRef<HTMLDivElement>()
  setTimeout(() => {
    loading.current?.classList.add("anim-out")
    setTimeout(() => {
      setL(false)
    }, 1100)
  }, 5000)

  return (
    <div id="home">
      {
        l
          ? <div id="loading-screen" ref={loading}><Loader /></div>
          : ""
      }
      <h1>Hello World!</h1>
    </div>
  )
}

export default Home
