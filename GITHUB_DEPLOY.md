# 🚀 Deploy Space4U to GitHub (10 minutes)

## Step 1: Create GitHub Repository (2 mins)

1. Go to [github.com](https://github.com)
2. Click **"+"** (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `Space4U`
   - **Description**: Mental health support platform
   - **Visibility**: Public (or Private)
   - **DON'T** check "Initialize with README" (you already have one)
4. Click **"Create repository"**
5. **Copy the repository URL** shown (looks like: `https://github.com/yourusername/Space4U.git`)

---

## Step 2: Initialize Git Locally (3 mins)

Open terminal in your Space4U folder and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Space4U mental health app with backend"

# Rename branch to main
git branch -M main

# Connect to GitHub (replace with YOUR repository URL)
git remote add origin https://github.com/yourusername/Space4U.git

# Push to GitHub
git push -u origin main
```

---

## Step 3: Verify Upload (1 min)

1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. Check that `backend/` folder is there

---

## 🚨 If You Get Errors

### "Git not found"
Install Git: [git-scm.com/download/win](https://git-scm.com/download/win)

### "Permission denied"
```bash
# Use HTTPS with token or SSH
git remote set-url origin https://github.com/yourusername/Space4U.git
```

### "Large files warning"
```bash
# Add to .gitignore
echo "node_modules/" >> .gitignore
git rm -r --cached node_modules
git commit -m "Remove node_modules"
git push
```

---

## ✅ Success Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] All files visible on GitHub
- [ ] `backend/` folder present
- [ ] Ready for Railway deployment

---

## 🎯 Next: Deploy to Railway

Now that code is on GitHub, follow **DEPLOY_RAILWAY.md** to deploy your backend!

---

## 💡 Quick Commands Reference

```bash
# Check git status
git status

# Add new changes
git add .
git commit -m "Your message"
git push

# View remote URL
git remote -v
```

**Your code is now on GitHub! 🎉**
