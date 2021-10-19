export interface User {
  id: string,
  avatar: string,
  username: string,
  color?: string,
  bot?: boolean,
  server?: boolean,
  temp?: boolean
}
