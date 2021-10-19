import { Channel } from '../../@types'
import { db } from '../store'
import { construct } from './id'

export const createChannel = async (name: string, index = -1): Promise<Channel | undefined> => {
  const id = construct()
  
  await db.run(/*sql*/`
    INSERT INTO channels (
      "id",
      "index",
      "name"
    ) VALUES (
      $1,
      $2,
      $3
    );
  `, [id, index, name])

  return getChannelById(id)
}
export const getChannels = async(): Promise<Channel[]> => {
  return await db.all<Channel[]>(/*sql*/`
    SELECT * FROM channels;
  `)
}
export const getChannelById = async(id: string): Promise<Channel | undefined> => {
  return await db.get<Channel>(/*sql*/`
    SELECT * FROM channels WHERE id = $1;
  `, [id])
}
