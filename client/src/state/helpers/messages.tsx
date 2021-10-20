import React from 'react'
import {
  messageState,
} from '../'
import { useRecoilCallback } from 'recoil'
import {
  Message,
  MessageFamily,
} from '../../../../@types'

export function setChannelMessages(): (messages: MessageFamily) => void {
  return useRecoilCallback(({ set }) => (messages: MessageFamily) => {
    set(messageState(messages.id), messages)
  })
}

export function addMessage(): (channel: string, message: Message) => void {
  return useRecoilCallback(({ set, snapshot }) => (channel: string, message: Message) => {
    const cur = snapshot.getLoadable(messageState(channel)).getValue()
    set(messageState(channel), {
      id: channel,
      messages: [
        message,
        ...cur?.messages || [],
      ],
    })
  })
}
export function removeMessage(): (channel: string, message: string) => void {
  return useRecoilCallback(({ set, snapshot }) => (channel: string, message: string) => {
    const cur = snapshot.getLoadable(messageState(channel)).getValue()
    const msgs = cur?.messages || []
    msgs.splice(msgs.findIndex((item) => item.id === message), 1)
    set(messageState(channel), {
      id: channel,
      messages: msgs,
    })
  })
}
