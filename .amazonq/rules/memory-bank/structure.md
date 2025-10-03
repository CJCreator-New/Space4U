# Project Structure & Architecture

## Directory Organization

### Root Level Configuration
```
Space4U/
├── index.html              # Main HTML entry point
├── package.json            # Project dependencies and scripts
├── vite.config.js          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

### Source Code Structure (`src/`)
```
src/
├── App.jsx                 # Main application component with routing
├── main.jsx               # React application entry point
├── index.css              # Global styles and Tailwind imports
├── components/            # Reusable UI components
├── pages/                 # Route-based page components
├── data/                  # Mock data and static content
└── utils/                 # Utility functions and helpers
```

## Core Components Architecture

### Application Entry (`src/App.jsx`)
- **Purpose**: Main application router and onboarding flow controller
- **Key Features**: Route management, onboarding state, loading states
- **Dependencies**: React Router DOM for navigation

### Component Categories

#### **UI Components (`src/components/`)**
- **Layout Components**: `Layout.jsx`, `Navigation.jsx` - App structure and navigation
- **Feature Components**: `MoodTracker.jsx`, `MoodTrends.jsx`, `MoodCalendar.jsx` - Mood tracking features
- **Interactive Components**: `CreatePostModal.jsx`, `FilterModal.jsx`, `BadgeUnlockModal.jsx` - User interactions
- **Display Components**: `PostCard.jsx`, `CircleCard.jsx`, `BadgeCard.jsx` - Content presentation
- **Specialized Components**: `BreathingExercisePlayer.jsx` - Wellness tools
- **Premium Components**: `PremiumPaywall.jsx` - Premium feature gating

#### **Onboarding Flow (`src/components/onboarding/`)**
- **Multi-step Process**: Welcome → Username → Age → Interests → Avatar selection
- **Components**: `OnboardingFlow.jsx`, `WelcomeScreen.jsx`, `UsernameStep.jsx`, `AgeConfirmationStep.jsx`, `InterestStep.jsx`, `AvatarStep.jsx`
- **Progress Tracking**: `ProgressIndicator.jsx` for user guidance

#### **Page Components (`src/pages/`)**
- **HomePage.jsx**: Dashboard with mood tracking and quick actions
- **CirclesPage.jsx**: Community discovery and management
- **CircleFeedPage.jsx**: Individual circle content and interactions
- **InsightsPage.jsx**: Analytics and personal insights dashboard
- **ProfilePage.jsx**: User profile and achievement management
- **ResourceLibraryPage.jsx**: Mental health resources and tools
- **SettingsPage.jsx**: Application preferences and user settings
- **PremiumPage.jsx**: Premium subscription and pricing page
- **PremiumSuccessPage.jsx**: Premium activation success page

## Data Architecture

### Mock Data System (`src/data/`)
- **mockPosts.js**: Sample community posts and interactions
- **mockCircles.js**: Community groups and categories
- **mockComments.js**: User interactions and discussions
- **mockResources.js**: Mental health resources and articles
- **mockAvatars.js**: User avatar options and customization

### Local Storage Strategy
- **User Data**: Profiles, preferences, and onboarding status
- **Mood Data**: Daily mood entries with timestamps and notes
- **Achievement Data**: Badge progress and unlocked achievements
- **Settings**: User preferences and application configuration
- **Premium Data**: Subscription status, trial info, and billing dates

## Utility Functions (`src/utils/`)

### **badgeSystem.js**
- Achievement tracking and badge unlock logic
- Progress calculation and milestone detection
- Badge categorization and reward system

### **moodAnalysis.js**
- Mood data processing and statistical analysis
- Trend calculation and pattern recognition
- Historical data aggregation

### **premiumUtils.js**
- Premium status management
- Subscription state handling
- Trial and billing date calculations

### **helpers.js**
- Common utility functions
- Data formatting and validation
- Shared business logic

## Architectural Patterns

### **Component-Based Architecture**
- Modular, reusable components with single responsibilities
- Props-based data flow and state management
- Composition over inheritance approach

### **Page-Based Routing**
- React Router DOM for client-side navigation
- Route-based code splitting potential
- Nested routing for complex features

### **Local-First Data Management**
- Browser localStorage for data persistence
- No external database dependencies
- Privacy-focused data handling

### **Responsive Design System**
- Tailwind CSS for utility-first styling
- Mobile-first responsive approach
- Consistent design tokens and spacing

## Technology Integration

### **Frontend Stack**
- **React 18**: Modern React with hooks and concurrent features
- **Vite**: Fast build tool and development server
- **React Router DOM**: Client-side routing and navigation

### **UI & Styling**
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Recharts**: Data visualization for mood trends and analytics

### **Development Tools**
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: CSS vendor prefix automation
- **TypeScript Types**: Type definitions for better development experience