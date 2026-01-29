<div align="center">

# Netflix-Inspired Portfolio

### Modern Personal Portfolio Web Application

A cutting-edge, immersive portfolio experience built with React, Firebase, and modern web technologies. Features a Netflix-style interface with animated intro, multi-profile system, and real-time social feed.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.6.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![DatoCMS](https://img.shields.io/badge/DatoCMS-GraphQL-FF7751?style=for-the-badge&logo=graphql&logoColor=white)](https://www.datocms.com/)

</div>

---

## ✨ Features

### 🎬 Netflix-Inspired Design
- **Authentic Intro Animation** - Full Netflix intro sequence with sound effects
- **Profile Selection** - "Who's Watching?" interface with 3 distinct personas
- **Row-Based Layout** - Horizontally scrollable content rows with smooth animations
- **Dark Theme** - Netflix-branded colors and typography

### 👤 Multi-Profile Experience
Three personalized profiles for different audiences:

- **Recruiter** - Professional-first view (Work Permit → Skills → Experience)
- **Developer** - Technical focus (Skills → Projects → Experience)
- **Stalker** - Personal content (Social Feed → Reading → Blogs)

### 💼 Professional Content
- **Work Experience** - Interactive vertical timeline component
- **Skills Matrix** - Categorized skills with letter-by-letter animations
- **Projects** - GitHub-integrated projects with live demos and tech stacks
- **Certifications** - Certificate grid with preview capability
- **Contact** - Professional contact information display

### 📱 Social Feed
- **Instagram-Style Interface** - Photo and video posts with likes
- **Real-time Sync** - Firebase Firestore integration for live updates
- **Interactive Features** - Double-tap to like, video mute controls
- **Cross-Device Persistence** - Like counts synced across devices

### 🔗 Integrations
- **GitHub API** - Dynamic project fetching with live metadata
- **DatoCMS** - Headless CMS for content management via GraphQL
- **Firebase** - Real-time database (Firestore) and media storage
- **Cloudinary** - Image optimization and delivery

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Static typing for robust code
- **React Router v6** - Client-side routing with lazy loading
- **CSS3** - Custom animations, glassmorphism, gradients

### Backend & Services
- **Firebase Firestore** - NoSQL database for social posts
- **Firebase Storage** - Media file uploads and management
- **DatoCMS** - Headless CMS with GraphQL API
- **GitHub API** - Repository data and project metadata

### Libraries & Tools
- **react-vertical-timeline-component** - Timeline visualization
- **react-icons** - Icon library (FontAwesome, Material Icons)
- **axios** - HTTP client for API requests
- **graphql-request** - GraphQL client for DatoCMS
- **Playwright** - Screenshot automation for documentation

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Firebase account (for social features)
- DatoCMS account (optional, has fallback data)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zeeza18/PORTFOLIO.git
   cd PORTFOLIO
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id

   # Cloudinary (for media optimization)
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

   # DatoCMS (optional - fallback data available)
   REACT_APP_DATOCMS_API_TOKEN=your_datocms_token
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   App will open at [http://localhost:3000](http://localhost:3000)

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 🍴 Using This Template

This portfolio is designed to be easily customizable for your own use!

### Quick Start for Your Portfolio

1. **Fork this repository** to your GitHub account

2. **Update content** in these key files:
   - `src/queries/getTimeline.ts` - Your work experience and education
   - `src/queries/getSkills.ts` - Your skills and expertise
   - `src/queries/getProjects.ts` - Your projects and GitHub repos
   - `src/queries/getContactMe.ts` - Your contact information
   - `src/queries/getProfileBanner.ts` - Hero section content

3. **Replace assets**:
   - Add your photos to `src/images/`
   - Update the Netflix sound (or remove it from `NetflixTitle.tsx`)
   - Add your resume PDF to `public/`

4. **Configure Firebase** (optional for social features):
   - Create a Firebase project
   - Enable Firestore and Storage
   - Add credentials to `.env`

5. **Deploy** to Netlify, Vercel, or your preferred hosting

### Optional: Connect DatoCMS

For dynamic content management without code changes:
1. Create a DatoCMS account
2. Set up models for projects, skills, timeline, etc.
3. Add your API token to `.env`

---

## 📁 Project Structure

```
src/
├── pages/                      # Main page components
│   ├── Projects.tsx           # GitHub-integrated projects
│   ├── Skills.tsx             # Skills matrix with animations
│   ├── WorkExperience.tsx     # Timeline component
│   ├── Certifications.tsx     # Certificate grid
│   ├── Social.tsx             # Instagram-style feed
│   ├── ContactMe.tsx          # Contact information
│   ├── Blogs.tsx              # Blog posts
│   └── ...
│
├── profilePage/               # Netflix-style dashboard
│   ├── profilePage.tsx        # Main profile view
│   ├── ProfileBanner.tsx      # Hero section
│   ├── TopPicksRow.tsx        # Content rows
│   └── ContinueWatching.tsx   # Recommendations
│
├── browse/                    # Profile selection
│   └── browse.tsx             # "Who's Watching?" page
│
├── components/                # Reusable components
│   ├── NavBar.tsx             # Header with sidebar
│   ├── ProfileCard.tsx        # Profile cards
│   └── ...
│
├── queries/                   # Data fetching layer
│   ├── datoCMSClient.ts       # GraphQL client
│   ├── getProjects.ts         # Projects with fallback
│   ├── getSkills.ts           # Skills data
│   ├── getTimeline.ts         # Work experience
│   └── ...
│
├── utils/                     # Utility functions
│   ├── zeezaPosts.ts          # Firestore CRUD operations
│   ├── zeezaMedia.ts          # Firebase Storage handling
│   └── typography.ts          # Text formatting
│
├── config/                    # Configuration
│   └── firebase.ts            # Firebase initialization
│
├── App.tsx                    # Main routing
├── Layout.tsx                 # Page wrapper
└── NetflixTitle.tsx           # Intro animation
```

---

## 🎨 Key Features Breakdown

### Netflix Intro Sequence
- Authentic Netflix "N" animation with fade-in effect
- Custom sound effect (netflix-sound.mp3)
- Smooth transition to profile selection
- CSS keyframe animations

### Dynamic Content Loading
- **Primary**: DatoCMS via GraphQL queries
- **Secondary**: GitHub API for live project data
- **Tertiary**: Firebase Firestore for social content
- **Fallback**: Hardcoded data ensures content always displays

### Social Feed Implementation
```typescript
// Real-time Firestore integration
- Posts collection with media references
- Atomic like count increments
- localStorage for device-specific likes
- Real-time listeners with onSnapshot
- Firebase Storage for media uploads
```

### Responsive Design
- Mobile-first approach
- Hamburger menu with slide-out sidebar
- Touch-friendly card scrolling
- Breakpoints for tablets and desktops

---

## 🔥 Firebase Setup

### Firestore Collections
- **zeezaPosts** - Social media posts
  - `caption`: string
  - `date`: string
  - `mediaKey`: string (Firebase Storage reference)
  - `likes`: number
  - `createdAt`: timestamp

### Storage Structure
```
/media/
  ├── media-{postId}    # Post media files
  └── ...
```

---

## 🎨 Customization

### Update Your Content

1. **Work Experience** - Edit `src/queries/getTimeline.ts` to update the fallback timeline data
2. **Skills** - Modify `src/queries/getSkills.ts` to customize your skills
3. **Projects** - Update `src/queries/getProjects.ts` with your GitHub projects
4. **Contact Info** - Edit `src/queries/getContactMe.ts` for your contact details
5. **Profile Banner** - Update `src/queries/getProfileBanner.ts` for hero section

### Add Your Own Data

Connect DatoCMS for dynamic content management or use the built-in fallback data system.

---

## 📝 Scripts

```bash
# Development
npm start              # Start dev server on localhost:3000
npm run build          # Production build
npm test               # Run tests

# Screenshots (requires Playwright)
node capture-screenshots.js    # Capture UI screenshots
```

---

## 🌐 Deployment

### Build & Deploy
```bash
# Create optimized production build
npm run build

# Deploy to hosting platform
# (Netlify, Vercel, Firebase Hosting, AWS Amplify, etc.)
```

### Environment Variables for Production
Ensure all Firebase and API credentials are set in your hosting platform's environment configuration.

---

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -m 'Add improvement'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Questions or Issues?

Feel free to open an issue or submit a pull request if you find any bugs or have suggestions for improvements.

---

## 🙏 Acknowledgments

- Netflix for design inspiration
- React community for excellent documentation
- Firebase for backend infrastructure
- DatoCMS for content management platform
- Open source contributors

---

<div align="center">

**Built with ❤️ using React, TypeScript, and Firebase**

⭐ Star this repo if you find it helpful!

</div>
