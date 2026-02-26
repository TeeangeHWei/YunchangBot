'use client'
import { useState } from 'react'
import { useTodos } from './hooks/useTodos'
import { Priority } from './types/todo'
import TodoItem from './components/TodoItem'
import TodoForm from './components/TodoForm'

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

export default function Home() {
  const { todos, categories, addTodo, updateTodo, deleteTodo, toggleTodo } = useTodos()
  const [showForm, setShowForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'done'>('all')
  const [search, setSearch] = useState('')

  const filtered = todos
    .filter(t => {
      if (filterCategory && t.categoryId !== filterCategory) return false
      if (filterPriority && t.priority !== filterPriority) return false
      if (filterStatus === 'active' && t.completed) return false
      if (filterStatus === 'done' && !t.completed) return false
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])

  const total = todos.length
  const done = todos.filter(t => t.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📝 Todo List</h1>
          <p className="text-sm text-gray-500 mt-1">已完成 {done} / {total} 项</p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: total ? `${(done / total) * 100}%` : '0%' }}
            />
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl p-3 shadow-sm mb-4 space-y-2">
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="🔍 搜索任务..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none" value={filterStatus} onChange={e => setFilterStatus(e.target.value as 'all' | 'active' | 'done')}>
              <option value="all">全部</option>
              <option value="active">未完成</option>
              <option value="done">已完成</option>
            </select>
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none" value={filterPriority} onChange={e => setFilterPriority(e.target.value as Priority | '')}>
              <option value="">所有优先级</option>
              <option value="high">🔴 高</option>
              <option value="medium">🟡 中</option>
              <option value="low">🟢 低</option>
            </select>
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="">所有分类</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4 border border-indigo-200">
            <TodoForm
              categories={categories}
              onSubmit={(todo) => { addTodo(todo); setShowForm(false) }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mb-4 py-2.5 rounded-xl border-2 border-dashed border-indigo-300 text-indigo-400 text-sm hover:border-indigo-500 hover:text-indigo-600 transition-colors"
          >
            + 添加任务
          </button>
        )}

        {/* Todo List */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              {todos.length === 0 ? '还没有任务，添加一个吧 🎉' : '没有匹配的任务'}
            </div>
          )}
          {filtered.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              categories={categories}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
