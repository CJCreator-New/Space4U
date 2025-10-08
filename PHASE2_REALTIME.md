# Phase 2: Real-time Features ✅

## Overview

Real-time features enable live updates across devices without page refresh.

---

## What's Implemented

### Real-time Hooks
- ✅ **useRealtimePosts** - Live post updates in circles
- ✅ **useRealtimeComments** - Live comment updates
- ✅ **useOnlineUsers** - Track online users with presence

### Services
- ✅ **circleService** - Circle operations (join, leave, post, comment)
- ✅ **moodService** - Mood CRUD operations (Phase 1)

---

## Setup Required

### 1. Enable Real-time in Supabase

**Run this SQL in Supabase SQL Editor:**

```sql
-- Enable real-time for posts
ALTER PUBLICATION supabase_realtime ADD TABLE posts;

-- Enable real-time for comments
ALTER PUBLICATION supabase_realtime ADD TABLE comments;

-- Enable real-time for circle_members
ALTER PUBLICATION supabase_realtime ADD TABLE circle_members;
```

Or just run: `REALTIME_SETUP.sql`

### 2. Verify Real-time is Enabled

**Supabase Dashboard:**
1. Go to **Database** → **Replication**
2. Check **supabase_realtime** publication
3. Verify tables are listed: posts, comments, circle_members

---

## Usage Examples

### Real-time Posts in Circle

```javascript
import { useRealtimePosts } from '../hooks/useRealtimePosts'

function CircleFeed({ circleId }) {
  const { posts, loading } = useRealtimePosts(circleId)
  
  // Posts update automatically when new posts are created!
  return (
    <div>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  )
}
```

### Real-time Comments

```javascript
import { useRealtimeComments } from '../hooks/useRealtimeComments'

function PostComments({ postId }) {
  const { comments, loading } = useRealtimeComments(postId)
  
  // Comments appear instantly!
  return (
    <div>
      {comments.map(comment => <Comment key={comment.id} comment={comment} />)}
    </div>
  )
}
```

### Online Users Count

```javascript
import { useOnlineUsers } from '../hooks/useOnlineUsers'

function CircleHeader({ circleId }) {
  const onlineCount = useOnlineUsers(circleId)
  
  return <div>{onlineCount} users online</div>
}
```

### Create Post with Service

```javascript
import { circleService } from '../services/circleService'
import { useSupabaseAuth } from '../contexts/AuthContext'

function CreatePost({ circleId }) {
  const { user } = useSupabaseAuth()
  
  async function handlePost(content) {
    await circleService.createPost(user.id, circleId, content)
    // Post appears instantly for all users!
  }
}
```

---

## Features

### Live Updates
- ✅ New posts appear instantly
- ✅ New comments appear instantly
- ✅ Online user count updates live
- ✅ No page refresh needed

### Multi-device Sync
- ✅ Post on phone → See on desktop instantly
- ✅ Comment on desktop → See on phone instantly
- ✅ Join circle → All devices update

### Performance
- ✅ WebSocket connections (efficient)
- ✅ Automatic reconnection
- ✅ Cleanup on unmount
- ✅ Minimal bandwidth usage

---

## Testing Real-time

### Test Live Posts

1. **Open two browser windows** (or devices)
2. **Login to same circle** in both
3. **Create post** in window 1
4. **See it appear** instantly in window 2!

### Test Live Comments

1. **Open post** in two windows
2. **Add comment** in window 1
3. **See it appear** instantly in window 2!

### Test Online Users

1. **Open circle** in multiple windows
2. **Watch online count** increase
3. **Close window** → Count decreases

---

## Next Steps

### Integrate with Existing Pages

**Update CircleFeedPage:**
```javascript
import { useRealtimePosts } from '../hooks/useRealtimePosts'

function CircleFeedPage() {
  const { circleId } = useParams()
  const { posts, loading } = useRealtimePosts(circleId)
  const onlineCount = useOnlineUsers(circleId)
  
  // Replace localStorage with real-time data
}
```

**Update PostCard:**
```javascript
import { useRealtimeComments } from '../hooks/useRealtimeComments'

function PostCard({ post }) {
  const { comments } = useRealtimeComments(post.id)
  
  // Comments update live!
}
```

---

## Phase 3 Preview: Multi-device Sync

Next phase will add:
- Bi-directional mood sync
- Offline queue for pending changes
- Conflict resolution
- Sync status indicators

---

## Troubleshooting

### Real-time not working?
**Fix:** Run `REALTIME_SETUP.sql` in Supabase SQL Editor

### Posts not appearing live?
**Fix:** Check browser console for WebSocket errors

### Online count always 0?
**Fix:** Verify user is logged in and circleId is valid

---

**Status**: ✅ Real-time Ready  
**Next**: Integrate with existing pages  
**Test**: Open two windows and see live updates!
