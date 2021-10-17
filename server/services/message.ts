import { db } from '../store'
import { construct } from './id'
import { Message } from '../../@types'

const lastBackup = "9999999999999999999999999999999999999999"


export const createMessage = async (channel: string, author: string, message: string): Promise<Message> => {
  const id = construct()

  await db.run(/*sql*/`
    INSERT INTO messages (
      "id",
      "channel",
      "author",
      "message",
      "date"
    ) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5
    )
  `, [id, channel, author, message, Date.now()])

  return getMessageById(id)
}
export const getMessages = async (): Promise<Message[]> => {
  return await db.all<Message[]>(/*sql*/`
    SELECT * FROM messages;
  `)
}
export const getMessageById = async (id: string): Promise<Message> => {
  return await db.get<Message>(/*sql*/`
    SELECT * FROM messages WHERE author = $1;
  `, [id])
}
export const getMessagesByChannel = async (channel: string, limit = 100, last = lastBackup): Promise<Message[]> => {
  if (limit > 100 || limit < 1) throw Error("Limit Range MUST Be Between 1-100")
  
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
  
  return await db.all<Message[]>(/*sql*/`
    SELECT * FROM (
      SELECT * FROM messages
      WHERE author = $1
      AND CAST(id AS INTEGER) < $2
      ORDER BY CAST(id AS INTEGER) DESC
    ) LIMIT $3;
  `, [author, last, limit])
}
