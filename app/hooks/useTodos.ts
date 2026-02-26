'use client'
import { useState, useEffect } from 'react'
import { Todo, Category } from '../types/todo'

const TODOS_KEY = 'todos'
const CATEGORIES_KEY = 'categories'

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '工作', color: '#6366f1' },
  { id: '2', name: '生活', color: '#22c55e' },
  { id: '3', name: '学习', color: '#f59e0b' },
]

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)

  useEffect(() => {
    const savedTodos = localStorage.getItem(TODOS_KEY)
    const savedCategories = localStorage.getItem(CATEGORIES_KEY)
    if (savedTodos) setTodos(JSON.parse(savedTodos))
    if (savedCategories) setCategories(JSON.parse(savedCategories))
  }, [])

  const saveTodos = (next: Todo[]) => {
    setTodos(next)
    localStorage.setItem(TODOS_KEY, JSON.stringify(next))
  }

  const saveCategories = (next: Category[]) => {
    setCategories(next)
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(next))
  }

  const addTodo = (todo: Omit<Todo, 'id' | 'createdAt'>) => {
    const next = [...todos, { ...todo, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]
    saveTodos(next)
  }

  const updateTodo = (id: string, patch: Partial<Todo>) => {
    saveTodos(todos.map(t => t.id === id ? { ...t, ...patch } : t))
  }

  const deleteTodo = (id: string) => {
    saveTodos(todos.filter(t => t.id !== id))
  }

  const toggleTodo = (id: string) => {
    saveTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const addCategory = (cat: Omit<Category, 'id'>) => {
    const next = [...categories, { ...cat, id: crypto.randomUUID() }]
    saveCategories(next)
  }

  const deleteCategory = (id: string) => {
    saveCategories(categories.filter(c => c.id !== id))
  }

  return { todos, categories, addTodo, updateTodo, deleteTodo, toggleTodo, addCategory, deleteCategory }
}
