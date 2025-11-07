const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' }
})

// Middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) return next(new Error('Authentication error'))
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.userId = decoded.userId
    socket.username = decoded.username
    next()
  } catch (err) {
    next(new Error('Invalid token'))
  }
})

// Connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`)

  // Join circle room
  socket.on('join_circle', (circleId) => {
    socket.join(`circle:${circleId}`)
    console.log(`User ${socket.userId} joined circle ${circleId}`)
  })

  // Leave circle room
  socket.on('leave_circle', (circleId) => {
    socket.leave(`circle:${circleId}`)
  })

  // Post comment
  socket.on('post_comment', async (data) => {
    const { circleId, content } = data
    
    // Rate limiting check
    const key = `rate:${socket.userId}:${circleId}`
    // Implement rate limiting logic here
    
    // Save to database
    const comment = {
      id: generateId(),
      circleId,
      content,
      author: {
        id: socket.userId,
        username: socket.username
      },
      timestamp: new Date().toISOString()
    }
    
    // Broadcast to circle room
    io.to(`circle:${circleId}`).emit('new_comment', comment)
  })

  // Typing indicator
  socket.on('typing', ({ circleId }) => {
    socket.to(`circle:${circleId}`).emit('user_typing', {
      userId: socket.userId,
      username: socket.username
    })
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`)
  })
})

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const PORT = process.env.WS_PORT || 3001
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`)
})
