import { useMemo } from 'react'
import useSWR from 'swr'
import { storage } from '../services/storage'

// Custom fetcher for hearted posts data
const heartedPostsFetcher = async () => {
  try {
    const heartedPostsData = await storage.get('space4u_hearted_posts')
    return heartedPostsData || []
  } catch (error) {
    console.error('Error fetching hearted posts:', error)
    return []
  }
}

// Hook for fetching hearted posts data with SWR
export function useHeartedPostsSWR() {
  const { data: heartedPosts = [], error, isLoading, mutate } = useSWR(
    'space4u_hearted_posts',
    heartedPostsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
      refreshInterval: 0, // No automatic refresh
    }
  )

  // Function to update hearted posts data
  const updateHeartedPosts = async (postsData) => {
    try {
      await storage.set('space4u_hearted_posts', postsData)

      // Update SWR cache
      mutate(postsData, false) // false = don't revalidate

      return { success: true }
    } catch (error) {
      console.error('Error updating hearted posts:', error)
      return { success: false, error }
    }
  }

  // Function to heart/unheart a post
  const toggleHeartPost = async (postId, isHearted) => {
    try {
      const currentHearted = await storage.get('space4u_hearted_posts') || []
      const updatedHearted = isHearted
        ? [...currentHearted, postId]
        : currentHearted.filter(id => id !== postId)

      await storage.set('space4u_hearted_posts', updatedHearted)

      // Update SWR cache
      mutate(updatedHearted, false)

      return { success: true }
    } catch (error) {
      console.error('Error toggling heart on post:', error)
      return { success: false, error }
    }
  }

  return {
    heartedPosts,
    error,
    isLoading,
    mutate,
    updateHeartedPosts,
    toggleHeartPost
  }
}