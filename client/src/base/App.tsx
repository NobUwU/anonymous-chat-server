import React from 'react'
import Router from '../router'
import { RecoilRoot } from 'recoil'
// Global Stylesheet
import "scss/global.scss"

import "./App.scss"

export default function App() {
  return (
    <RecoilRoot>
      <div>
        <Router />
      </div>
    </RecoilRoot>
  )
}
