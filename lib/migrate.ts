import { drizzle } from "drizzle-orm/neon-http"
import { migrate } from "drizzle-orm/neon-http/migrator"
import { neon } from "@neondatabase/serverless"
import * as fs from 'fs'
import * as path from 'path'

const ensureMigrationDirs = () => {
  const dirs = ['drizzle', 'drizzle/meta']
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })

  const journalPath = 'drizzle/meta/_journal.json'
  if (!fs.existsSync(journalPath)) {
    const initialJournal = {
      version: "5",
      dialect: "pg",
      entries: [{
        idx: 0,
        version: "5",
        when: Date.now(),
        tag: "0000_initial",
        breakpoints: true
      }]
    }
    fs.writeFileSync(journalPath, JSON.stringify(initialJournal, null, 2))
  }
}

const runMigration = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set")
  }

  try {
    ensureMigrationDirs()

    const sql = neon(process.env.DATABASE_URL)
    const db = drizzle(sql)

    console.log("Running migrations...")
    await migrate(db, { migrationsFolder: "drizzle" })
    console.log("Migrations completed successfully!")
    
    process.exit(0)
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

runMigration()

