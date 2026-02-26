'use client'
import { useState } from 'react'
import { Todo, Category, Priority } from '../types/todo'

type Props = {
  categories: Category[]
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt'>) => void
  onCancel: () => void
  initial?: Todo
}

const PRIORITY_LABELS: Record<Priority, string> = { high: '🔴 高', medium: '🟡 中', low: '🟢 低' }

export default function TodoForm({ categories, onSubmit, onCancel, initial }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'medium')
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? '')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title: title.trim(), description, priority, categoryId: categoryId || undefined, dueDate: dueDate || undefined, completed: initial?.completed ?? false })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="任务标题 *"
        value={title}
        onChange={e => setTitle(e.target.value)}
        autoFocus
      />
      <textarea
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        placeholder="描述（可选）"
        rows={2}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <div className="flex gap-2">
        <select
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
        >
          {(Object.keys(PRIORITY_LABELS) as Priority[]).map(p => (
            <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
          ))}
        </select>
        <select
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
        >
          <option value="">无分类</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <input
        type="date"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
      />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100">取消</button>
        <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-indigo-500 text-white hover:bg-indigo-600">保存</button>
      </div>
    </form>
  )
}
