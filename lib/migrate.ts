import { drizzle } from "drizzle-orm/neon-http"
import { migrate } from "drizzle-orm/neon-http/migrator"
import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

const runMigration = async () => {
  try {
    const sql = neon(process.env.DATABASE_URL)
    const db = drizzle(sql)

    console.log("Running migrations...")
    await migrate(db, { migrationsFolder: "./drizzle" })
    console.log("Migrations completed successfully!")
    
    process.exit(0)
  } catch (error) {
    console.error("Error running migrations:", error)
    process.exit(1)
  }
}

runMigration()

