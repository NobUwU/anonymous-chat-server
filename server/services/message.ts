import { db } from '../store'
import { construct } from './id'
import { Message } from '../../@types'
import {
  getChannelById,
} from './channel'
import {
  getUserById,
} from './user'

const lastBackup = "9999999999999999999999999999999999999999"


export const createMessage = async (channel: string, author: string, message: string): Promise<Message | undefined> => {
  const id = construct()

  await db.run(/*sql*/`
    INSERT INTO messages (
      "id",
      "channel",
      "author",
      "content",
      "date"
    ) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5
    )
  `, [id, channel, author, message, String(Date.now())])

  return getMessageById(id)
}
export const getMessages = async (): Promise<Message[]> => {
  return await db.all<Message[]>(/*sql*/`
    SELECT * FROM messages;
  `)
}
export const getMessageById = async (id: string): Promise<Message | undefined> => {
  return await db.get<Message>(/*sql*/`
    SELECT * FROM messages WHERE id = $1;
  `, [id])
}
export const getMessagesByChannel = async (channel: string, limit = 100, last = lastBackup): Promise<Message[]> => {
  if (limit > 100 || limit < 1) throw Error("Limit Range MUST Be Between 1-100")
  
  const chan = await getChannelById(channel)
  if (!chan) throw Error("Channel Does Not Exist!")

  return await db.all<Message[]>(/*sql*/`
    SELECT * FROM (
      SELECT * FROM messages
      WHERE channel = $1
      AND CAST(id AS INTEGER) < $2
      ORDER BY CAST(id AS INTEGER) DESC
    ) LIMIT $3;
  `, [channel, last, limit])
}

export const getMessagesByAuthor = async (author: string, limit = 100, last = lastBackup): Promise<Message[]> => {
  if (limit > 100 || limit < 1) throw Error("Limit Range MUST Be Between 1-100")
  
  const user = getUserById(author)
  if (!user) throw Error("User Does Not Exist")

  return await db.all<Message[]>(/*sql*/`
    SELECT * FROM (
      SELECT * FROM messages
      WHERE author = $1
      AND CAST(id AS INTEGER) < $2
      ORDER BY CAST(id AS INTEGER) DESC
    ) LIMIT $3;
  `, [author, last, limit])
}
