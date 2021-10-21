/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import * as Helpers from '../state/helpers'
import C from '../../../constants'
import { emitter } from './events'

export let client: WebSocket
// @ts-ignore
const host = NODE_ENV === "development"
  // @ts-ignore
  ? `${location.hostname}:${PORT || 6970}`
  : location.host

const connectionUri = `${location.protocol === "https:" ? "wss:" : "ws:"}//${host}/`

let reconAttempts = 0

export function send<Payload>(code: string, payload: Payload): void {
  const event = JSON.stringify({
    code,
    payload,
  })
  if (client && client.OPEN) {
    client.send(event)
    console.log(`SENDING PAYLOAD:`, `[${code}]`, payload)
  }
}

export function startConnection(): () => Promise<void> {
  const loadOn = Helpers.setLoading()
  const loadOff = Helpers.stopLoading()
  // const attemptConnection = startConnection()

  return React.useCallback(() => new Promise((resolve) => {
    client = new WebSocket(connectionUri)

    reconAttempts++
  
    client.addEventListener("open", () => {
      loadOff()
      reconAttempts = 0
      console.log("Connected To Websocket Server")
      resolve()
    })
  
    client.addEventListener("message", (event) => {
      const { code, payload } = JSON.parse(event.data) as {
        code: string
        payload: unknown
      }
  
      console.log(`[${code}]`, payload)
      emitter.emit(code, payload)
    })
  
    client.addEventListener("close", () => {
      loadOn()
      console.error("Websocket Connection Closed")
      emitter.emit("ws_closed")
    })
  }), [])
}

// Keep connection alive
setInterval(() => {
  send("PING", {})
}, 15 * 1000)
