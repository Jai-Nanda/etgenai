import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
}

interface Expense {
  id: string;
  userId: string;
  description: string;
  amount: number;
  time: string;
  date: string;
  category?: string;
}

interface Data {
  users: User[];
  expenses: Expense[];
}

const adapter = new JSONFile<Data>('db.json')
const db = new Low<Data>(adapter, { users: [], expenses: [] })

await db.read()

export { db }