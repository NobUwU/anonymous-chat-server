import { db } from '../store'
import { construct } from './id'
import { User } from '../../@types'

export const createUser = async (username: string, avatar = "/static/logo.png", color = "#ffffff"): Promise<User | undefined> => {
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
export const getUserById = async (id: string): Promise<User | undefined> => {
  return await db.get<User>(/*sql*/`
    SELECT * FROM users WHERE id = $1;
  `, [id])
}
export const deleteUser = async (id: string): Promise<User> => {
  const user = await getUserById(id)
  if (!user) throw Error("User Does Not Exist!")

  await db.run(/*sql*/`
    DELETE FROM users WHERE id = $1;
  `, [id])

  return user
}
export const updateUserUsername = async (id: string, username: string): Promise<User> => {
  const user = await getUserById(id)
  if (!user) throw Error("User Does Not Exist!")

  await db.run(/*sql*/`
    UPDATE users SET username = $1 WHERE id = $2;
  `, [username, id])

  return {
    ...user,
    username, 
  }
}
export const updateUserAvatar = async (id: string, avatar: string): Promise<User> => {
  const user = await getUserById(id)
  if (!user) throw Error("User Does Not Exist!")

  await db.run(/*sql*/`
    UPDATE users SET avatar = $1 WHERE id = $2;
  `, [avatar, id])

  return {
    ...user,
    avatar,
  }
}
export const updateUserColor = async (id: string, color: string): Promise<User> => {
  const user = await getUserById(id)
  if (!user) throw Error("User Does Not Exist!")

  await db.run(/*sql*/`
    UPDATE users SET color = $1 WHERE id = $2;
  `, [color, id])

  return {
    ...user,
    color,
  }
}
