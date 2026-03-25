import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }

  const existingUser = db.data.users.find(u => u.email === email)
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name
  }

  db.data.users.push(newUser)
  await db.write()

  return NextResponse.json({ message: 'User created' }, { status: 201 })
}