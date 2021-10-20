import React from 'react'
import {
  userState,
  currentUserState,
} from '../'
import {
  useRecoilValue,
  useRecoilState,
  useRecoilCallback,
} from 'recoil'
import { User } from '../../../../@types'

export function addUser(): (user: User) => void {
  return useRecoilCallback(({ set }) => (user: User) => {
    set(userState(user.id), user)
  })
}
export function deleteUser(): (id: string) => void {
  return useRecoilCallback(({ reset }) => (id: string) => {
    reset(userState(id))
  })
}

export function setCurrentUser(): (user: User) => void {
  const [, setCur] = useRecoilState(currentUserState)

  return React.useCallback((user: User) => {
    localStorage.setItem('uid', user.id)
    setCur(user)
  }, [])
}
export function getCurrentUser(): () => User {
  const user = useRecoilValue(currentUserState)

  return React.useCallback(() => user, [user])
}
