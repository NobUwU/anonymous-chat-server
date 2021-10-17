export interface Message {
  id: string,
  channel: string,
  author: string,
  message: string,
  date: number,
  failed?: boolean
}

export interface MessageFamily {
  id: string
  messages: Message[]
}
