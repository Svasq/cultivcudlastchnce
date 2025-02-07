import { drizzle } from "drizzle-orm/neon-http"
import { migrate } from "drizzle-orm/neon-http/migrator"
import { neon } from "@neondatabase/serverless"

const runMigration = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set")
  }

  const sql = neon(process.env.DATABASE_URL)
  const db = drizzle(sql)

  console.log("Running migrations...")

  await migrate(db, { migrationsFolder: "drizzle" })

  console.log("Migrations complete!")
}

runMigration().catch(console.error)

