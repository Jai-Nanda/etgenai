import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const DEFAULT_USER = 'default-user'

export async function GET() {
  const expenses = db.data.expenses.filter(e => e.userId === DEFAULT_USER)
  return NextResponse.json(expenses)
}

export async function POST(request: NextRequest) {
  const { description, amount, time, category } = await request.json()
  const newExpense = {
    id: Date.now().toString(),
    userId: DEFAULT_USER,
    description,
    amount: parseFloat(amount),
    time,
    date: new Date().toISOString(),
    category
  }

  db.data.expenses.push(newExpense)
  await db.write()

  return NextResponse.json(newExpense, { status: 201 })
}