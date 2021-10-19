export interface Message {
  id: string,
  channel: string,
  author: string,
  content: string,
  date: string,
  failed?: boolean
}

export interface MessageFamily {
  id: string
  messages: Message[]
}
