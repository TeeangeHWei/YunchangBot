export type Priority = 'high' | 'medium' | 'low'

export type Category = {
  id: string
  name: string
  color: string
}

export type Todo = {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: Priority
  categoryId?: string
  dueDate?: string // ISO date string
  createdAt: string
}
