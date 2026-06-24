'use client'

import { useState, useEffect } from 'react'
import {
  addCategory,
  getCategories,
  deleteCategory,
} from '@/app/actions/expenses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Category {
  id: string
  name: string
  color: string
  icon: string
}

const ICON_OPTIONS = [
  '🍔', '🚗', '🎬', '🛍️', '💡', '🏥', '📱', '✈️',
  '🎮', '🏋️', '📚', '☕', '🎵', '⚽', '🎨', '🌍'
]

const COLOR_OPTIONS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
]

export function CategoryManager({ onCategoryAdded }: { onCategoryAdded?: () => void }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[5])
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      console.error('Failed to load categories:', err)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    setIsLoading(true)
    try {
      await addCategory(newCategoryName, selectedColor, selectedIcon)
      setNewCategoryName('')
      setSelectedColor(COLOR_OPTIONS[5])
      setSelectedIcon(ICON_OPTIONS[0])
      await loadCategories()
      onCategoryAdded?.()
    } catch (err) {
      console.error('Failed to add category:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Delete this category?')) return

    try {
      await deleteCategory(categoryId)
      await loadCategories()
    } catch (err) {
      console.error('Failed to delete category:', err)
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between font-semibold text-foreground hover:text-primary transition-colors"
      >
        <span>Manage Categories</span>
        <span className="text-lg">{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen && (
        <div className="space-y-4 border-t border-border pt-4">
          {/* Add Category Form */}
          <div className="space-y-3 p-3 bg-secondary/30 rounded-lg">
            <Label htmlFor="category-name" className="text-sm">
              New Category Name
            </Label>
            <Input
              id="category-name"
              type="text"
              placeholder="e.g., Groceries"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />

            <div>
              <Label className="text-sm mb-2 block">Select Icon</Label>
              <div className="grid grid-cols-8 gap-2">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setSelectedIcon(icon)}
                    className={`p-2 rounded-lg text-lg transition-colors ${
                      selectedIcon === icon
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm mb-2 block">Select Color</Label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      selectedColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <Button
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? 'Adding...' : 'Add Category'}
            </Button>
          </div>

          {/* Categories List */}
          {categories.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm">Your Categories</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        style={{ backgroundColor: cat.color }}
                      >
                        {cat.icon}
                      </div>
                      <span className="text-sm font-medium">{cat.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
