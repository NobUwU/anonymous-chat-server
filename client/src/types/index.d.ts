export interface Channel {
  id: string,
  index: number,
  name: string
}
export interface Message {
  id: string,
  channel: string,
  author: string,
  message: string,
  date: number
}
export interface User {
  id: string,
  avatar: string,
  username: string,
  color?: string
}
