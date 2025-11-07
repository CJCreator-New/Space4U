import { useState, useEffect, useCallback, useRef } from 'react'
import { io } from 'socket.io-client'

export function useCircleComments(circleId) {
  const [comments, setComments] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    // Connect to WebSocket server
    const socket = io(process.env.REACT_APP_WS_URL || 'ws://localhost:3001', {
      auth: {
        token: localStorage.getItem('space4u_auth_token')
      }
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      socket.emit('join_circle', circleId)
    })

    socket.on('disconnect', () => setConnected(false))

    // Listen for new comments
    socket.on('new_comment', (comment) => {
      setComments(prev => [...prev, comment])
    })

    // Listen for typing indicators
    socket.on('user_typing', ({ userId, username }) => {
      setTypingUsers(prev => {
        if (prev.find(u => u.userId === userId)) return prev
        return [...prev, { userId, username }]
      })

      // Remove after 3 seconds
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u.userId !== userId))
      }, 3000)
    })

    // Load initial comments
    fetch(`/api/circles/${circleId}/comments`)
      .then(res => res.json())
      .then(data => setComments(data))

    return () => {
      socket.emit('leave_circle', circleId)
      socket.disconnect()
    }
  }, [circleId])

  const postComment = useCallback(async (content) => {
    if (!socketRef.current || !content.trim()) return

    const comment = {
      circleId,
      content: content.trim(),
      timestamp: new Date().toISOString()
    }

    // Optimistic update
    const tempComment = {
      ...comment,
      id: `temp-${Date.now()}`,
      author: 'You',
      pending: true
    }
    setComments(prev => [...prev, tempComment])

    try {
      // Send to server
      socketRef.current.emit('post_comment', comment)
    } catch (err) {
      // Remove optimistic comment on error
      setComments(prev => prev.filter(c => c.id !== tempComment.id))
    }
  }, [circleId])

  const sendTypingIndicator = useCallback(() => {
    if (!socketRef.current) return

    socketRef.current.emit('typing', { circleId })

    // Debounce typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('stop_typing', { circleId })
    }, 3000)
  }, [circleId])

  return {
    comments,
    typingUsers,
    connected,
    postComment,
    sendTypingIndicator
  }
}
