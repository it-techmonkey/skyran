# SKYRAN Real Estate Website

A modern, luxury property listing platform for Dubai real estate. Built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **4 Complete Pages**: Home, Properties, Developers, About, and Contact
- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)
- **Modern UI**: Clean, professional design with smooth animations
- **Property Listings**: Featured properties with detailed information
- **Developer Profiles**: Complete developer directory with search functionality
- **Contact Form**: Fully validated contact form
- **Interactive Maps**: Google Maps integration for location display

## 🛠️ Technology Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

## 📦 Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx      # Navigation header
│   │   └── Footer.jsx      # Footer component
│   ├── home/
│   │   ├── HeroSection.jsx
│   │   ├── PropertyCard.jsx
│   │   ├── FeaturedProperties.jsx
│   │   ├── DevelopersSection.jsx
│   │   ├── WhyChooseUs.jsx
│   │   └── CTASection.jsx
│   └── ui/
│       ├── Button.jsx      # Reusable button component
│       ├── Badge.jsx       # Badge component
│       └── Card.jsx        # Card wrapper component
├── pages/
│   ├── Home.jsx           # Homepage
│   ├── Properties.jsx     # Properties listing page
│   ├── Developers.jsx     # Developers directory
│   ├── About.jsx          # About us page
│   └── Contact.jsx        # Contact page
├── data/
│   ├── properties.js      # Property mock data
│   ├── developers.js      # Developer mock data
│   ├── features.js        # Features and stats data
│   ├── team.js            # Team member data
│   └── contact.js         # Contact information
├── App.jsx                # Main app component with routing
├── main.jsx               # Entry point
└── index.css              # Global styles and Tailwind imports
```

## 🎨 Design System

### Colors
- **Primary Blue**: `#3B82F6`
- **Navy Dark**: `#1E293B`
- **Black**: `#000000`
- **White**: `#FFFFFF`
- **Ready Badge**: `#10B981` (green)
- **Featured Badge**: `#6B7280` (gray)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Sizes**: Responsive scale from 12px to 60px
- **Weights**: 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)

## 📱 Responsive Breakpoints

- **Mobile**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+
- **Large Desktop**: 1280px+

## 🔧 Customization

### Adding New Properties
Edit `src/data/properties.js` to add or modify property listings.

### Adding New Developers
Edit `src/data/developers.js` to add or modify developer profiles.

### Modifying Colors
Update the color values in `tailwind.config.js` under the `theme.extend.colors` section.

## 🌐 Pages

### Home
- Hero section with search functionality
- Featured properties showcase
- Premier developers grid
- Why choose us section
- Call-to-action section

### Properties
- Property listing grid
- Filter functionality (can be extended)

### Developers
- Developer directory
- Search functionality
- Developer cards with details

### About
- Company story
- Statistics
- Core values
- Team section

### Contact
- Contact information cards
- Contact form with validation
- Google Maps integration

## 📝 Form Validation

The contact form includes:
- Required field validation
- Email format validation
- Phone number format validation
- Error message display
- Success message on submission

## 🖼️ Images

Images are loaded from Unsplash for demonstration purposes. In production, replace with your own optimized images.

## 🚀 Deployment

This app can be deployed to:
- **Vercel**: Connect your repository to Vercel for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **GitHub Pages**: Use the `gh-pages` package
- **Any static host**: Upload the `dist` folder after running `npm run build`

## 📄 License

This project is created for demonstration purposes.

## 👤 Author

SKYRAN Real Estate Team

---

**Built with ❤️ using React and Tailwind CSS**

