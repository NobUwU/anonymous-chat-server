import Websocket from 'ws'
import { construct } from '../../services/id'
// import { User } from '../../../@types'

const PORT = Number(process.env.PORT) || 6971

export const server = new Websocket.Server({
  port: PORT,
})
export const online: {
  socket: Websocket,
  connectionIdentifier: string
}[] = []

export function broadcast<Payload>(code: string, payload: Payload): void {
  online.forEach(({ socket }) => {
    sendEvent(socket, code, payload)
  })

  console.log(`[Network] [WS] [${code}]:`, payload)
}

export function sendEvent<Payload>(socket: Websocket, code: string, payload: Payload): void {
  socket.send(JSON.stringify({
    code,
    payload,
  }))
}

server.on('connection', (socket, req) => {
  console.log("[Network] [WS]: Socket connection established")
  const connectionIdentifier = construct()
  
  online.push({
    socket,
    connectionIdentifier, 
  })

  socket.once('close', () => {
    console.log("[Network] [WS]: Socket connection closed")
    online.splice(online.findIndex((item) => item.connectionIdentifier === connectionIdentifier), 1)
  })
})

console.log("[Network]: WS server opened on port:", PORT)
