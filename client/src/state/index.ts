import {
  atom,
  selector,
} from 'recoil'
import {
  Channel,
  Message,
  User,
} from '../types/index'

export const channelsState = atom<Channel[]>({
  key: "channels",
  default: [],
})
export const channelsSelector = selector<Channel[]>({
  key: "allChannels",
  get: ({ get }) => {
    return get(channelsState)
  },
})

export const usersState = atom<User[]>({
  key: "users",
  default: [],
})
export const usersSelector = selector<User[]>({
  key: "allUsers",
  get: ({ get }) => {
    return get(usersState)
  },
})

export const messagesState = atom<Message[]>({
  key: "messages",
  default: [],
})
export const messagesSelector = selector<Message[]>({
  key: "allMessages",
  get: ({ get }) => {
    return get(messagesState)
  },
})

export const currentUserState = atom<string>({
  key: "currentUser",
  default: "",
})
export const currentUserSelector = selector<string>({
  key: "theCurrentUser",
  get: ({ get }) => {
    return get(currentUserState)
  },
})
