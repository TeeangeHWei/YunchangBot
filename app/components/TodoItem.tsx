'use client'
import { useState } from 'react'
import { Todo, Category, Priority } from '../types/todo'
import TodoForm from './TodoForm'

type Props = {
  todo: Todo
  categories: Category[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, patch: Partial<Todo>) => void
}

const PRIORITY_COLOR: Record<Priority, string> = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-yellow-100 text-yellow-600',
  low: 'bg-green-100 text-green-600',
}
const PRIORITY_LABEL: Record<Priority, string> = { high: '高', medium: '中', low: '低' }

export default function TodoItem({ todo, categories, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const category = categories.find(c => c.id === todo.categoryId)
  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date()

  if (editing) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-200">
        <TodoForm
          categories={categories}
          initial={todo}
          onSubmit={(patch) => { onUpdate(todo.id, patch); setEditing(false) }}
          onCancel={() => setEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${todo.completed ? 'opacity-50 border-gray-200' : 'border-gray-200 hover:border-indigo-200'}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="mt-1 w-4 h-4 accent-indigo-500 cursor-pointer"
        />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{todo.title}</p>
          {todo.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{todo.description}</p>}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLOR[todo.priority]}`}>{PRIORITY_LABEL[todo.priority]}</span>
            {category && (
              <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: category.color }}>{category.name}</span>
            )}
            {todo.dueDate && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${isOverdue ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500'}`}>
                {isOverdue ? '⚠️ ' : '📅 '}{todo.dueDate}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-indigo-500 text-sm px-1">✏️</button>
          <button onClick={() => onDelete(todo.id)} className="text-gray-400 hover:text-red-500 text-sm px-1">🗑️</button>
        </div>
      </div>
    </div>
  )
}
