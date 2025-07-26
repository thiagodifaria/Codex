# Codex - Personal Productivity Application

> **Note**: Codex is a personal productivity web application designed to assist in the integrated management of activities such as personal diary, task lists, projects, and long-term goals. Built with modern technologies and focus on user experience.

## 🌐 Online Demo

**Access the application in real time**: [Coming soon - Production deployment]

## 📕 Description

Codex is a robust and modern personal productivity application that integrates multiple organizational functionalities into a single platform. Developed with Next.js 15 and TypeScript, the project uses a component-based architecture with React, employing Tailwind CSS and Shadcn UI to create an elegant and intuitive interface.

The application stands out for its holistic approach to productivity, combining personal diary functionalities, task and project management, goal and habit tracking in a unified and fluid experience.

## 📸 Screenshots

### Personalized Dashboard
*[Future screenshot]*

### Project Management
*[Future screenshot]*

### Goals and Habits System
*[Future screenshot]*

## ✨ Main Features

- ✅ **Intuitive Dashboard**: Daily summary with journal entries, pending tasks, project progress, and habit check-ins
- ✅ **Rich Text Editor (Tiptap)**: Integrated editor with advanced formatting support
  - Bold, italic, headings, and lists
  - Quotes and code blocks
  - Hyperlinks and structured content
- ✅ **Digital Journal**: 
  - Dated journal entries
  - Calendar navigation
  - Rich content with titles and formatting
- ✅ **Global Task List**: 
  - Management of tasks independent of projects
  - Priority system (lowest to highest)
  - Customizable status: "to do", "in progress", "blocked", "under review", "completed"
  - Due dates and notifications
- ✅ **Complete Project Management**:
  - Creation, listing, and editing of projects
  - Detailed overview of each project
  - Milestone system and roadmap
  - Project status: "planning", "active", "on hold", "completed", "archived"
  - Links to external resources
- ✅ **Goals and Progress System**:
  - Definition of long-term goals
  - Sub-goals for objective breakdown
  - Integrated habit tracker
- ✅ **Complete Authentication**: Login, registration, and password recovery
- ✅ **Customizable Profile**: Avatar, biography, and personal information
- ✅ **Advanced Settings**:
  - Notification preferences (email and push)
  - Themes: light, dark, or system
  - Language and timezone settings
  - Data management and privacy

## 🛠️ Technology Stack

### Framework & Core
- **Next.js 15.2.3**: React framework with App Router
- **TypeScript**: Static typing for robustness
- **React 18**: Library for interactive interfaces

### Interface & Design
- **Tailwind CSS**: Utility framework for styling
  - **@tailwindcss/typography**: Plugin for typographic content
  - **tailwindcss-animate**: Custom animations
- **Shadcn UI**: Complete component system
  - Accordion, AlertDialog, Avatar, Badge, Calendar
  - Checkbox, Dialog, DropdownMenu, Menubar, Popover
  - Progress, ScrollArea, Select, Separator, Sheet
  - Skeleton, Slider, Switch, Table, Tabs, Textarea
  - Toast, Tooltip and much more
- **Lucide React**: Modern icon library
- **Inter Font**: Main typography for interface

### Forms & Validation
- **React Hook Form**: Performant form management
- **Zod**: Robust schema validation

### State & Cache
- **TanStack Query (React Query)**: Server state management
- **@tanstack-query-firebase/react**: Firebase integration

### Editor & Content
- **Tiptap**: Rich and extensible text editor
  - **@tiptap/starter-kit**: Essential functionalities
  - **@tiptap/extension-placeholder**: Placeholder texts

### Internationalization
- **i18next**: Internationalization system
- **react-i18next**: React integration
- **i18next-browser-languagedetector**: Automatic language detection
- **Supported Languages**: English, Spanish, and Portuguese (Brazil)

### Utilities & Tools
- **clsx & tailwind-merge**: CSS class management
- **date-fns**: Date manipulation and formatting
- **patch-package**: Applying patches to dependencies

### Backend & Hosting
- **Firebase**: Complete backend platform
- **Firebase App Hosting**: Hosting with optimized configuration

### Development
- **ESLint**: Code linting
- **tsx**: TypeScript script execution
- **turbopack**: Next.js development bundler

## 📋 Prerequisites

- Node.js 18+ or higher
- npm, yarn, or pnpm (package manager)
- Firebase account (for backend and authentication)
- Firebase project configuration

## 🚀 Installation and Configuration

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/codex.git
cd codex
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### 3. Configure Firebase
Create a project in [Firebase Console](https://console.firebase.google.com/) and configure:

1. Authentication (Email/Password)
2. Firestore Database
3. Storage (optional)

### 4. Configure Environment Variables
Create a `.env.local` file in the project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Other configurations (optional)
NEXT_PUBLIC_APP_ENV=development
```

### 5. Run the Application

```bash
# Development
npm run dev
# or
yarn dev
# or
pnpm dev

# Production build
npm run build

# Start production
npm run start

# Linting
npm run lint
```

Access `http://localhost:3000` to view the application.

## 🏗️ Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication route group
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   └── forgot-password/ # Password recovery
│   ├── (app)/               # Main application group
│   │   ├── dashboard/       # Main dashboard
│   │   ├── journal/         # Journal system
│   │   ├── tasks/           # Global task list
│   │   ├── projects/        # Project management
│   │   ├── goals/           # Goals system
│   │   ├── profile/         # User profile
│   │   └── settings/        # Settings
│   ├── layout.tsx           # Main layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   ├── ui/                  # Shadcn UI components
│   ├── auth/                # Authentication components
│   ├── journal/             # Journal components
│   ├── tasks/               # Task components
│   ├── projects/            # Project components
│   ├── goals/               # Goals components
│   └── layout/              # Layout components
│       ├── Sidebar.tsx      # Main sidebar
│       ├── Header.tsx       # Application header
│       └── Navigation.tsx   # Main navigation
├── lib/                     # Utilities and configurations
│   ├── utils.ts             # Utility functions
│   ├── firebase.ts          # Firebase configuration
│   ├── validations.ts       # Zod schemas
│   └── constants.ts         # Application constants
├── types/                   # TypeScript definitions
│   └── codex.ts             # Codex-specific types
├── hooks/                   # Custom hooks
│   ├── useAuth.ts           # Authentication hook
│   ├── useTheme.ts          # Theme hook
│   └── useLocalStorage.ts   # localStorage hook
└── providers/               # Context Providers
    ├── AuthProvider.tsx     # Authentication provider
    └── ThemeProvider.tsx    # Theme provider
```

## 🎨 Interface and Design

### Theme System
- **Light Theme**: Clean and modern interface
- **Dark Theme**: Visual fatigue reduction
- **System**: Follows OS preferences

### Typography
- **Main Font**: Inter - optimized readability
- **Hierarchy**: Well-defined H1-H6 titles
- **Body Text**: Adequate spacing and contrast

### Visual Components
- **Cards**: Rounded corners and subtle borders
- **Animations**: Smooth transitions and visual feedback
- **Hover Effects**: Intuitive interactions
- **Loading States**: Elegant loading indicators

## ⚙️ Detailed Features

### Dashboard
The Codex command center offers:
- Personalized daily summary
- Prioritized pending tasks
- Active project progress
- Habit check-ins
- Upcoming milestones

### Tiptap Editor
Rich editor with functionalities:
- **Formatting**: Bold, italic, underline
- **Structure**: Headings, lists, quotes
- **Code**: Code blocks with syntax highlighting
- **Links**: Hyperlink insertion and editing
- **Placeholder**: Contextual help texts

### Task System
Complete management with:
- **Priorities**: 5 priority levels
- **Status**: Customizable workflow
- **Dates**: Due dates and reminders
- **Categorization**: Tags and filters

### Projects
Professional organization with:
- **Overview**: Description and objectives
- **Tasks**: Project-specific list
- **Roadmap**: Milestones and timeline
- **Resources**: Links and documentation
- **Status**: Progress tracking

## 📱 Responsiveness

### Breakpoints
- **Mobile**: < 768px - Touch-first interface
- **Tablet**: 768px - 1024px - Adapted layout
- **Desktop**: > 1024px - Complete experience

### Mobile Adaptations
- Collapsible sidebar
- Gesture navigation
- Touch-optimized buttons
- Adapted contextual menu

## 🔧 Available Scripts

```bash
# Development with Turbopack
npm run dev

# Optimized build
npm run build

# Production
npm run start

# Linting
npm run lint

# Type checking
npm run type-check

# Apply patches
npm run postinstall
```

## 🚀 Deploy

### Firebase App Hosting (Recommended)
```bash
# Configure Firebase CLI
npm install -g firebase-tools
firebase login

# Deploy
firebase deploy
```

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy with automatic configuration
vercel
```

### Netlify
- Build command: `npm run build`
- Publish directory: `.next`
- Configure environment variables in panel

## 🔐 Security and Privacy

### Authentication
- Secure system via Firebase Auth
- Client-side and server-side validation
- JWT tokens for sessions

### Data
- Encryption in transit and at rest
- Strict validation with Zod
- Input sanitization

### Privacy
- Protected personal data
- Granular privacy settings
- Regulatory compliance

## 📊 Performance

### Optimizations
- **Code Splitting**: On-demand loading
- **Tree Shaking**: Elimination of unused code
- **Caching**: Aggressive cache strategies
- **Lazy Loading**: Components and images

### Target Metrics
- **Core Web Vitals**: All criteria met
- **Bundle Size**: Optimized for fast loading
- **Runtime Performance**: Fluid interactions

## 🌍 Internationalization

### Supported Languages
- **Portuguese (Brazil)**: Default language
- **English**: Complete translation
- **Spanish**: International support

### i18n Features
- Automatic language detection
- Localized date formatting
- Regional numbers and currencies
- Translated interface texts

## 🧪 Planned Features

### Next Implementations
- **Collaboration**: Project sharing
- **Public API**: Third-party integration
- **Mobile App**: Native application
- **Offline Sync**: Complete PWA
- **Reports**: Productivity analytics
- **Integrations**: Calendar, GitHub, Slack

### Continuous Improvements
- **Performance**: Constant optimizations
- **UX**: User feedback
- **Accessibility**: WCAG compliance
- **Testing**: Complete coverage

## 🤝 Contributions

Contributions are welcome to improve Codex:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

### Guidelines
- Follow existing code standards
- Write tests for new features
- Document significant changes
- Keep commits organized

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions, suggestions, or collaborations:

- **Email**: [your-email@example.com](mailto:your-email@example.com)
- **LinkedIn**: [linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)
- **GitHub**: [github.com/your-username](https://github.com/your-username)

**Project Link**: [https://github.com/your-username/codex](https://github.com/your-username/codex)

---

**Technologies**: Next.js 15 + TypeScript + Tailwind CSS + Firebase  
**Status**: In active development