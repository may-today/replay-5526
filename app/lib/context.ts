import { createContext } from 'react'

export const CurrentInViewContext = createContext<{ inView: boolean }>({
  inView: false,
})
