import {
  open,
  Database, 
} from 'sqlite'
import { initStore } from '../services/init'
import sqlite3 from 'sqlite3'
import path from 'path'
import fs from 'fs'

const dbDirectory = path.join("./db")

if (!fs.existsSync(dbDirectory)) fs.mkdirSync(dbDirectory)

const storeFile = path.join(dbDirectory, "store.db")

export let db: Database<sqlite3.Database, sqlite3.Statement>

export const storeTask = async () => {
  db = await open({
    filename: storeFile,
    driver: sqlite3.verbose().cached.Database,
  })

  // Set Foreign Key Contraints
  await db.get("PRAGMA foreign_keys = ON;")

  await initStore()
}
