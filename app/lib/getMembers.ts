import { neon } from "@neondatabase/serverless";

export async function getMembers() {
    const sql = neon(process.env.DATABASE_URL!);
    const data = await sql`SELECT * FROM posts;`;
    return data;
}
