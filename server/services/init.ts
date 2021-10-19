import { db } from '../store'
import {
  getChannels,
  createChannel,
} from './channel'
import { createMessage } from './message'
import {
  createServer,
  getUserById,
} from './user'

export const initStore = async () => {
  await db.exec(/*sql*/`
    CREATE TABLE IF NOT EXISTS channels (
      "id" TEXT NOT NULL,
      "index" INTEGER NOT NULL,
      "name" TEXT NOT NULL,

      PRIMARY KEY("id")
    );
    
    CREATE TABLE IF NOT EXISTS users (
      "id" TEXT NOT NULL,
      "username" TEXT NOT NULL,
      "avatar" TEXT,
      "color" TEXT,
      "bot" BOOLEAN DEFAULT false,
      "server" BOOLEAN DEFAULT false,

      PRIMARY KEY("id")
    );

    CREATE TABLE IF NOT EXISTS messages (
      "id" TEXT NOT NULL,
      "channel" TEXT NOT NULL,
      "author" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "date" TEXT NOT NULL,

      PRIMARY KEY("id"),
      FOREIGN KEY("channel") REFERENCES channels("id"),
      FOREIGN KEY("author") REFERENCES users("id")
    );
  `)

  // Check if channels. If none add two
  let channels = await getChannels()
  if (!channels.length) {
    await createChannel("general-1")
    await createChannel("general-2")
    channels = await getChannels()
  }
  const serverClient = await getUserById("123")
  if (!serverClient) {
    await createServer("123", "Overseerr", "/static/logo-colored.png", "#bc69ff")
    for (const channel of channels) {
      await createMessage(channel.id, "123", `New Channel \`#${channel.name}\` Created!`)
    }
  }
}
