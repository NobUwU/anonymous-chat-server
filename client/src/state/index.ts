import {
  atom,
  selector,
  atomFamily,
  selectorFamily,
  DefaultValue,
} from 'recoil'
import {
  Message,
  User,
  Channel,
  MessageFamily,
} from '../../../@types'

const guardRecoilDefault = (
  candidate: unknown,
): candidate is DefaultValue => {
  if (candidate instanceof DefaultValue) return true
  
  return false
}

export const userFamily = atomFamily<User, string>({
  key: "userState",
  default: undefined,
})
export const userIdState = atom<string[]>({
  key: "userIds",
  default: [],
})
export const userState = selectorFamily<User, string>({
  key: "userAccess",
  get: (id) => ({ get }) => {
    const atom = get(userFamily(id))

    return atom
  },
  set: (id) => ({ set, reset }, user) => {
    if (guardRecoilDefault(user)) {
      reset(userFamily(id))
      set(userIdState, (oldIds) => oldIds.filter((idList) => idList !== id))

      return
    }
    set(userFamily(id), user)
    set(userIdState, (prev) => [...prev, user.id])
  },
})

export const channelFamily = atomFamily<Channel, string>({
  key: "channelState",
  default: undefined,
})
export const channelIdState = atom<string[]>({
  key: "channelIds",
  default: [],
})
export const channelState = selectorFamily<Channel, string>({
  key: "channelsAccess",
  get: (id) => ({ get }) => {
    const atom = get(channelFamily(id))
    
    return atom
  },
  set: (id) => ({ set, reset }, channel) => {
    if (guardRecoilDefault(channel)) {
      reset(channelFamily(id))
      set(channelIdState, (oldIds) => oldIds.filter((idList) => idList !== id))
      
      return
    }
    set(channelFamily(id), channel)
    set(channelIdState, (prev) => [...prev, channel.id])
  },
})

export const messageFamily = atomFamily<MessageFamily, string>({
  key: "messageState",
  default: undefined,
})
export const messageIdState = atom<string[]>({
  key: "messageIds",
  default: [],
})
export const messageState = selectorFamily<MessageFamily, string>({
  key: "messageAccess",
  get: (id) => ({ get }) => {
    const atom = get(messageFamily(id))
    
    return atom
  },
  set: (id) => ({ set, reset }, message) => {
    if (guardRecoilDefault(message)) {
      reset(messageFamily(id))
      set(messageIdState, (oldIds) => oldIds.filter((idList) => idList !== id))
      
      return
    }
    set(messageFamily(id), message)
    set(messageIdState, (prev) => [message.id, ...prev])
  },
})

export const currentUserState = atom<User>({
  key: "currentUser",
  default: undefined,
})
export const loadingState = atom<boolean>({
  key: "loading",
  default: true,
})
