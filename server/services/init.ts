import { db } from '../store'

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

      PRIMARY KEY("id")
    );

    CREATE TABLE IF NOT EXISTS messages (
      "id" TEXT NOT NULL,
      "channel" TEXT NOT NULL,
      "author" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "date" TEXT NOT NULL,

      PRIMARY KEY("id"),
      FOREIGN KEY("channel") REFERENCES channels("id"),
      FOREIGN KEY("author") REFERENCES users("id")
    );
  `)
}
