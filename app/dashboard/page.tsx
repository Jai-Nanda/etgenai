'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { analyzeExpenses } from '../../utils/analysis'

interface Expense {
  id: string;
  userId: string;
  description: string;
  amount: number;
  time: string;
  date: string;
  category?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', time: '', category: '' })
  const [analysis, setAnalysis] = useState<any>(null)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    const res = await fetch('/api/expenses')
    const data = await res.json()
    setExpenses(data)
    setAnalysis(analyzeExpenses(data))
  }

  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExpense)
    })
    if (res.ok) {
      setNewExpense({ description: '', amount: '', time: '', category: '' })
      fetchExpenses()
    }
  }

  // Prepare chart data
  const categoryData = expenses.reduce((acc, exp) => {
    const cat = exp.category || (exp.description.toLowerCase().includes('swiggy') || exp.description.toLowerCase().includes('zomato') ? 'Food' : 'Other')
    acc[cat] = (acc[cat] || 0) + exp.amount
    return acc
  }, {} as Record<string, number>)

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }))

  const dailyData = expenses.reduce((acc, exp) => {
    const day = new Date(exp.date).toDateString()
    acc[day] = (acc[day] || 0) + exp.amount
    return acc
  }, {} as Record<string, number>)

  const barData = Object.entries(dailyData).map(([day, amount]) => ({ day, amount }))

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-[#111f3d] shadow-2xl border border-[#2e4565]">
          <div>
            <h1 className="text-4xl font-bold text-[#38bdf8]">Expense Genie Dashboard</h1>
            <p className="text-[#94a3b8] mt-1">Visual summary of your spending story and savings path.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-[#172e4d] px-4 py-2 text-[#d9e8ff] border border-[#2c4a6d]">Public Demo</div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
            <form onSubmit={addExpense} className="space-y-4">
              <input
                type="text"
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Time (HH:MM)"
                value={newExpense.time}
                onChange={(e) => setNewExpense({ ...newExpense, time: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Add Expense</button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
            <PieChart width={300} height={300}>
              <Pie data={pieData} cx={150} cy={150} outerRadius={80} fill="#8884d8" dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Daily Spending</h2>
            <BarChart width={300} height={300} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </div>
        </div>

        {analysis && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Money Story</h2>
            <p className="mb-4"><strong>Persona:</strong> {analysis.persona.name} - {analysis.persona.description}</p>
            <p className="mb-4"><strong>Story:</strong> {analysis.story.text}</p>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Futures</h3>
              {analysis.futures.map((f: any, i: number) => (
                <p key={i}><strong>{f.scenario}:</strong> {f.description}</p>
              ))}
            </div>
            <div>
              <h3 className="text-xl font-semibold">Tiny Actions</h3>
              <ul>
                {analysis.actions.map((a: any, i: number) => (
                  <li key={i}>{a.description}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
          <ul className="space-y-2">
            {expenses.slice(-10).map((exp) => (
              <li key={exp.id} className="flex justify-between">
                <span>{exp.description} - {exp.category || 'Other'}</span>
                <span>₹{exp.amount} at {exp.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}