import React from 'react'
import { loadingState } from '../'
import { useRecoilCallback } from 'recoil'

export function setLoading() {
  return useRecoilCallback(({ set }) => () => {
    set(loadingState, true)
    // This is improper but works well
    const loading = document.getElementById("loading-screen")
    if (loading) {
      loading.classList.remove("anim-out")
    }
  })
}

export function stopLoading() {
  return useRecoilCallback(({ set }) => () => {
    // This is improper but works well
    const loading = document.getElementById("loading-screen")
    if (loading) {
      loading.classList.add("anim-out")
    }
    setTimeout(() => {
      set(loadingState, false)
    }, 1100)
  })
}
