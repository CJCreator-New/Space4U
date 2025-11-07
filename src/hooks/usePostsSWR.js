import { useMemo } from 'react'
import useSWR from 'swr'
import { storage } from '../services/storage'

// Custom fetcher for posts data
const postsFetcher = async () => {
  try {
    const postsData = await storage.get('space4u_user_posts')
    return postsData || []
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

// Hook for fetching all posts data with SWR
export function usePostsSWR() {
  const { data: allPosts = [], error, isLoading, mutate } = useSWR(
    'space4u_user_posts',
    postsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
      refreshInterval: 0, // No automatic refresh
    }
  )

  // Function to save posts data
  const savePosts = async (postsData) => {
    try {
      await storage.set('space4u_user_posts', postsData)

      // Update SWR cache
      mutate(postsData, false) // false = don't revalidate

      return { success: true }
    } catch (error) {
      console.error('Error saving posts:', error)
      return { success: false, error }
    }
  }

  // Function to add a new post
  const addPost = async (newPost) => {
    try {
      const currentPosts = await storage.get('space4u_user_posts') || []
      const updatedPosts = [newPost, ...currentPosts]
      await storage.set('space4u_user_posts', updatedPosts)

      // Update SWR cache
      mutate(updatedPosts, false)

      return { success: true }
    } catch (error) {
      console.error('Error adding post:', error)
      return { success: false, error }
    }
  }

  // Function to update a specific post
  const updatePost = async (postId, updatedPostData) => {
    try {
      const currentPosts = await storage.get('space4u_user_posts') || []
      const updatedPosts = currentPosts.map(post =>
        post.id === postId ? { ...post, ...updatedPostData } : post
      )
      await storage.set('space4u_user_posts', updatedPosts)

      // Update SWR cache
      mutate(updatedPosts, false)

      return { success: true }
    } catch (error) {
      console.error('Error updating post:', error)
      return { success: false, error }
    }
  }

  // Function to delete a post
  const deletePost = async (postId) => {
    try {
      const currentPosts = await storage.get('space4u_user_posts') || []
      const updatedPosts = currentPosts.filter(post => post.id !== postId)
      await storage.set('space4u_user_posts', updatedPosts)

      // Update SWR cache
      mutate(updatedPosts, false)

      return { success: true }
    } catch (error) {
      console.error('Error deleting post:', error)
      return { success: false, error }
    }
  }

  return {
    posts: allPosts,
    error,
    isLoading,
    mutate,
    savePosts,
    addPost,
    updatePost,
    deletePost
  }
}