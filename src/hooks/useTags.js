import { useState, useEffect } from 'react'
import { DEFAULT_TAGS } from '../constants/tags'

/**
 * Custom hook for managing mood tags
 * Handles both default and custom user-created tags
 */
export function useTags() {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = () => {
    try {
      const customTags = JSON.parse(localStorage.getItem('space4u_custom_tags') || '[]')
      setTags([...DEFAULT_TAGS, ...customTags])
    } catch (error) {
      console.error('Error loading tags:', error)
      setTags(DEFAULT_TAGS)
    } finally {
      setLoading(false)
    }
  }

  const createTag = (label, color = 'gray', category = 'custom') => {
    try {
      const customTags = JSON.parse(localStorage.getItem('space4u_custom_tags') || '[]')
      
      const newTag = {
        id: `custom_${Date.now()}`,
        label,
        color,
        category,
        custom: true,
        createdAt: new Date().toISOString()
      }

      const updatedCustomTags = [...customTags, newTag]
      localStorage.setItem('space4u_custom_tags', JSON.stringify(updatedCustomTags))
      
      setTags([...DEFAULT_TAGS, ...updatedCustomTags])
      return { success: true, tag: newTag }
    } catch (error) {
      console.error('Error creating tag:', error)
      return { success: false, error: error.message }
    }
  }

  const deleteTag = (tagId) => {
    try {
      const customTags = JSON.parse(localStorage.getItem('space4u_custom_tags') || '[]')
      const updatedCustomTags = customTags.filter(tag => tag.id !== tagId)
      
      localStorage.setItem('space4u_custom_tags', JSON.stringify(updatedCustomTags))
      setTags([...DEFAULT_TAGS, ...updatedCustomTags])
      
      return { success: true }
    } catch (error) {
      console.error('Error deleting tag:', error)
      return { success: false, error: error.message }
    }
  }

  const getTagById = (tagId) => {
    return tags.find(tag => tag.id === tagId)
  }

  const getTagsByCategory = (category) => {
    return tags.filter(tag => tag.category === category)
  }

  return {
    tags,
    loading,
    createTag,
    deleteTag,
    getTagById,
    getTagsByCategory,
    refreshTags: loadTags
  }
}

