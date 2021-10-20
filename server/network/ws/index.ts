import Websocket from 'ws'
import { construct } from '../../services/id'
import { rest } from '../rest'

export const server = new Websocket.Server({
  noServer: true,
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

server.on('connection', (socket) => {
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

rest.server.on('upgrade', (req, socket, head) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  server.handleUpgrade(req, socket as any, head, (ws) => {
    server.emit('connection', ws, req)
  })
})
console.log("[Network]: WS server opened on port:", rest.PORT)
