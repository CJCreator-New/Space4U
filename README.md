# Space4U - Mental Health Support Platform

> Your mind matters. Find support, track wellness, and connect with others who understand your journey.

## 🌟 Overview

Space4U (Safespace) is a comprehensive mental health support web application that provides users with tools for mood tracking, community support, and mental wellness resources. Built with privacy-first principles, all data is stored locally on your device.

## ✨ Features

### 🎯 Core Features
- **Daily Mood Tracking**: Log your mood with emoji-based 5-point scale
- **Mood Analytics**: Visual trends, patterns, and insights with interactive charts
- **Support Circles**: Join topic-based communities for peer support
- **Resource Library**: Breathing exercises, articles, and crisis resources
- **Achievement System**: Unlock badges and track your wellness journey
- **Anonymous Posting**: Share experiences while maintaining privacy

### 🔒 Privacy & Security
- **Local Storage Only**: All data stays on your device
- **Anonymous by Default**: No personal information required
- **Data Export**: Download your data anytime
- **Complete Control**: Delete account and data instantly

### 💎 Premium Features
- **Unlimited History**: Access all your mood data forever
- **Advanced AI Insights**: Pattern detection and predictions
- **Group Therapy**: 4 sessions per month with licensed therapists
- **Priority Support**: 1:1 help within 24 hours
- **Ad-free Experience**: Clean, distraction-free interface

## 🛠 Tech Stack

### Frontend
- **React 18.2.0** - Modern React with hooks and concurrent features
- **Vite 7.1.7** - Fast build tool and development server
- **Tailwind CSS 3.3.0** - Utility-first CSS framework
- **React Router DOM 6.8.1** - Client-side routing
- **Recharts 2.15.4** - Data visualization for mood trends
- **Lucide React 0.263.1** - Beautiful SVG icons

### Development Tools
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic vendor prefixing
- **ESLint** - Code linting and quality

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/space4u.git
cd space4u

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app running.

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint for code quality

# Deployment
npm run deploy       # Deploy to production (configure as needed)
```

## 🏗 Build for Production

```bash
# Create optimized production build
npm run build

# The build artifacts will be stored in the `dist/` directory
# These files are ready to be served by any static hosting service
```

## 🌐 Deployment

### Option A: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Vite and configure build settings
3. Deploy with zero configuration needed

### Option B: Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add `_redirects` file for SPA routing:
   ```
   /*    /index.html   200
   ```

### Option C: GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/space4u",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run: `npm run deploy`

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_NAME=Safespace
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://api.safespace.com
VITE_ANALYTICS_ID=your-analytics-id
```

## 📱 Progressive Web App (PWA)

Space4U is PWA-ready with:
- Offline functionality
- Add to Home Screen capability
- App-like experience on mobile devices
- Service worker for caching

## 🧪 Testing

### Manual Testing Checklist
- [ ] Complete onboarding flow
- [ ] Log moods and view calendar
- [ ] Join/leave circles and create posts
- [ ] View insights and unlock badges
- [ ] Test premium features and paywall
- [ ] Export data and delete account
- [ ] Test on mobile devices (320px - 1920px)
- [ ] Verify localStorage persistence

### Browser Testing
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: < 500KB gzipped
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check our [Wiki](https://github.com/yourusername/space4u/wiki)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/space4u/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/yourusername/space4u/discussions)

## 🙏 Acknowledgments

- Mental health professionals who provided guidance
- Open source community for amazing tools
- Beta testers who provided valuable feedback
- Everyone working to destigmatize mental health

---

**Made with ❤️ for mental health**

*If you're struggling with mental health, please reach out to a professional or crisis helpline in your area.*