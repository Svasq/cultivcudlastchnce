import { getMembers } from "@/app/lib/getMembers"
import { NextResponse } from "next/server"

export async function GET() {
  const members = await getMembers()
  return NextResponse.json(members)
}

