import React from 'react'
import { channelState } from '../'
import { useRecoilCallback } from 'recoil'
import { Channel } from '../../../../@types'

export function addChannel(): (channel: Channel) => void {
  return useRecoilCallback(({ set }) => (channel: Channel) => {
    set(channelState(channel.id), channel)
  })
}
export function removeChannel(): (id: string) => void {
  return useRecoilCallback(({ reset }) => (id: string) => {
    reset(channelState(id))
  })
}
