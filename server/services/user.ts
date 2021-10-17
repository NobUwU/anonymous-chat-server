import { db } from '../store'
import { construct } from './id'
import { User } from '../../@types'

export const createUser = async (username: string, avatar = "/static/logo.png", color = "#ffffff"): Promise<User> => {
  const id = construct()

  await db.run(/*sql*/`
    INSERT INTO users (
      "id",
      "username",
      "avatar",
      "color"
    ) VALUES (
      $1,
      $2,
      $3,
      $4
    );
  `, [id, username, avatar, color])

  return getUserById(id)
}
export const getUsers = async (): Promise<User[]> => {
  return await db.all<User[]>(/*sql*/`
    SELECT * FROM users;
  `)
}
export const getUserById = async (id: string): Promise<User> => {
  return await db.get<User>(/*sql*/`
    SELECT * FROM users WHERE id = $1;
  `, [id])
}
