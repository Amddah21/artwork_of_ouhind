# 🎨 ArtSpark Studio Canvas - Artist Portfolio

A beautiful, modern artist portfolio website with cloud database integration, featuring an elegant gallery, admin dashboard, and real-time artwork management.

![Portfolio Preview](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=ArtSpark+Studio+Canvas)

## ✨ Features

### 🖼️ **Gallery & Portfolio**

- **Dynamic Artwork Display**: Beautiful grid layout with hover effects
- **Category Filtering**: Filter artworks by technique, year, and style
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Image Protection**: Watermark overlays and right-click protection
- **Zoom Modal**: Full-screen artwork viewing experience

### 🎛️ **Admin Dashboard**

- **Cloud Database**: Real-time Supabase integration
- **CRUD Operations**: Add, edit, delete artworks seamlessly
- **Image Upload**: Base64 encoding with preview functionality
- **Form Validation**: Comprehensive input validation
- **Real-time Updates**: Changes reflect immediately across the app

### 🎨 **Design & UX**

- **Artistic Theme**: Warm color palette with gradients
- **Glass Morphism**: Modern UI with backdrop blur effects
- **Smooth Animations**: Framer Motion animations throughout
- **Typography**: Beautiful fonts (Playfair Display, Montserrat)
- **Mobile-First**: Responsive design for all devices

### 🔐 **Authentication & Security**

- **JWT Authentication**: Secure admin login system
- **Row Level Security**: Database-level security policies
- **Input Validation**: XSS and injection protection
- **Session Management**: Persistent login sessions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Amddah21/artspark-studio-canvas.git
   cd artspark-studio-canvas
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Supabase Database**

   - Go to your Supabase dashboard
   - Open SQL Editor
   - Copy and paste the contents of `supabase-setup.sql`
   - Run the script to create tables and sample data

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:8081
   - Admin Dashboard: http://localhost:8081/admin
   - Login: admin@artiste.com / admin123

## 🗄️ Database Setup

### Supabase Configuration

The project uses Supabase as the backend database. Run the following SQL script in your Supabase SQL Editor:

```sql
-- Copy and paste the entire supabase-setup.sql file
-- This creates:
-- - artworks table with sample data
-- - users table with admin account
-- - Security policies and indexes
-- - Auto-updating timestamps
```

### Database Schema

#### **artworks Table**

```sql
- id (BIGSERIAL PRIMARY KEY)
- titre (VARCHAR) - Artwork title
- description (TEXT) - Artwork description
- image_url (VARCHAR) - Image path/URL
- technique (VARCHAR) - Art technique
- dimensions (VARCHAR) - Size dimensions
- annee (INTEGER) - Creation year
- created_at (TIMESTAMP) - Creation date
- updated_at (TIMESTAMP) - Last update date
```

#### **users Table**

```sql
- id (BIGSERIAL PRIMARY KEY)
- username (VARCHAR UNIQUE) - Username
- email (VARCHAR UNIQUE) - Email address
- password (VARCHAR) - Hashed password
- role (VARCHAR) - User role (ADMIN)
- created_at (TIMESTAMP) - Account creation date
```

## 🎯 Usage

### **For Artists**

1. **Login to Admin Dashboard**: Navigate to `/admin`
2. **Add New Artwork**: Click "Ajouter une nouvelle œuvre"
3. **Fill Details**: Title, description, technique, dimensions, year
4. **Upload Image**: Drag & drop or click to select
5. **Save**: Artwork appears immediately in gallery

### **For Visitors**

1. **Browse Gallery**: View all artworks in beautiful grid
2. **Filter by Category**: Use category buttons to filter
3. **View Details**: Click artwork for detailed view
4. **Contact Artist**: Use contact form for inquiries

## 🛠️ Technology Stack

### **Frontend**

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **React Hook Form** - Form handling

### **Backend & Database**

- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security** - Database security
- **JWT Authentication** - Secure authentication
- **Real-time Subscriptions** - Live updates

### **UI Components**

- **shadcn/ui** - High-quality component library
- **Lucide React** - Beautiful icons
- **Custom Components** - Tailored for art portfolio

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── ArtisticNavbar.tsx
│   ├── Portfolio.tsx
│   ├── Hero.tsx
│   └── ...
├── contexts/           # React contexts
│   ├── ArtworkContext.tsx
│   ├── ReviewContext.tsx
│   └── RatingContext.tsx
├── pages/              # Page components
│   ├── Index.tsx
│   ├── AdminDashboard.tsx
│   ├── ArtworkDetail.tsx
│   └── ...
├── services/           # API services
│   ├── supabase-artwork-service.ts
│   └── supabase-auth-service.ts
├── lib/                # Utilities
│   ├── supabase.ts
│   └── utils.ts
└── styles/             # Global styles
    └── image-protection.css
```

## 🎨 Customization

### **Colors & Branding**

- Update color scheme in `tailwind.config.ts`
- Modify gradients in `src/index.css`
- Change logo in `src/components/Logo.tsx`

### **Content**

- Edit artist information in components
- Update contact details in footer
- Modify sample artworks in database

### **Features**

- Add new artwork categories
- Implement user registration
- Add artwork reviews/ratings
- Integrate payment processing

## 🔧 Development

### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### **Environment Variables**

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 Responsive Design

The website is fully responsive and optimized for:

- **Desktop**: 1920px+ (Full experience)
- **Laptop**: 1024px+ (Optimized layout)
- **Tablet**: 768px+ (Touch-friendly)
- **Mobile**: 320px+ (Mobile-first design)

## 🚀 Deployment

### **Vercel (Recommended)**

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### **Netlify**

1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `dist`

### **Supabase**

- Database is already hosted on Supabase
- No additional backend deployment needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - Amazing backend-as-a-service platform
- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Team** - Excellent frontend framework

## 📞 Support

For support, email support@artspark.com or create an issue in the repository.

---

**Made with ❤️ for artists by artists** 🎨✨
