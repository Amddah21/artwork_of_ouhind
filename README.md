# 🎨 ArtSpark Studio Canvas

A modern, full-stack art gallery application built with React, TypeScript, and Supabase.

## ✨ Features

### 🖼️ **Artwork Management**

- **Multiple Image Upload** - Upload multiple images per artwork
- **Dynamic Gallery** - Real-time artwork display
- **Artwork Details** - Comprehensive artwork information
- **Categories & Tags** - Organized artwork classification
- **Search & Filter** - Easy artwork discovery

### 👤 **Authentication System**

- **User Authentication** - Secure login/signup
- **Admin Dashboard** - Complete artwork management
- **Role-based Access** - User and admin roles
- **Protected Routes** - Secure admin access

### 🎨 **Admin Dashboard**

- **Add/Edit Artworks** - Full CRUD operations
- **Image Management** - Multiple image upload with previews
- **Clear All Data** - Database management tools
- **Real-time Updates** - Instant gallery updates

### 🗄️ **Backend Integration**

- **Supabase Database** - PostgreSQL with real-time features
- **Row Level Security** - Secure data access
- **Image Storage** - Base64 image storage
- **API Functions** - Custom database functions

## 🚀 **Tech Stack**

### **Frontend**

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful UI components

### **Backend**

- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security** - Data security
- **Real-time Subscriptions** - Live updates

### **Development Tools**

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 📦 **Installation**

### **Prerequisites**

- Node.js 18+
- npm or yarn
- Supabase account

### **Setup Steps**

1. **Clone the repository**

```bash
git clone https://github.com/Amddah21/artspark-studio-canvas.git
cd artspark-studio-canvas
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**
   Create `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Database Setup**
   Run the SQL scripts in `supabase/` directory:

- `schema.sql` - Main database schema
- `admin_setup.sql` - Admin user setup
- `multiple_images_schema.sql` - Multiple images support

5. **Start Development Server**

```bash
npm run dev
```

## 🗄️ **Database Schema**

### **Tables**

- **`artworks`** - Main artwork information
- **`artwork_images`** - Multiple images per artwork
- **`profiles`** - User profiles and roles
- **`ratings`** - Artwork ratings
- **`reviews`** - Artwork reviews

### **Key Features**

- **Foreign Key Relationships** - Linked artwork images
- **Row Level Security** - Secure data access
- **Custom Functions** - Database logic
- **Real-time Updates** - Live data synchronization

## 🎯 **Usage**

### **For Users**

1. **Browse Gallery** - View all available artworks
2. **Artwork Details** - Click on artwork for full details
3. **Rate & Review** - Leave ratings and reviews
4. **Contact** - Get in touch with the artist

### **For Admins**

1. **Login** - Use admin credentials
2. **Dashboard** - Access admin panel
3. **Add Artworks** - Upload new artworks with multiple images
4. **Manage Gallery** - Edit, delete, or clear all artworks
5. **Monitor Activity** - Track views and interactions

## 🔧 **Configuration**

### **Admin Credentials**

- **Email:** `omhind53@gmail.com`
- **Password:** `admin123`

### **Image Upload**

- **File Size Limit:** 50MB per image
- **Supported Formats:** PNG, JPG, JPEG
- **Multiple Images:** Up to 10 images per artwork

### **Database Settings**

- **Real-time:** Enabled for live updates
- **Security:** Row Level Security enabled
- **Backup:** Automatic backups enabled

## 📁 **Project Structure**

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   └── ...             # Custom components
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication
│   ├── ArtworkContext.tsx # Artwork management
│   └── ...            # Other contexts
├── pages/              # Page components
├── lib/                # Utility functions
└── styles/             # CSS styles

supabase/
├── schema.sql          # Database schema
├── admin_setup.sql     # Admin setup
└── ...                 # Other SQL files
```

## 🚀 **Deployment**

### **Vercel (Recommended)**

1. Connect GitHub repository to Vercel
2. Add environment variables
3. Deploy automatically

### **Netlify**

1. Connect GitHub repository
2. Configure build settings
3. Add environment variables

### **Manual Deployment**

1. Build the project: `npm run build`
2. Upload `dist/` folder to your hosting service
3. Configure environment variables

## 🔒 **Security Features**

- **Row Level Security** - Database-level security
- **Authentication** - Secure user authentication
- **Protected Routes** - Admin-only access
- **Input Validation** - Client and server-side validation
- **Environment Variables** - Secure configuration

## 📊 **Performance**

- **Image Optimization** - Base64 encoding for fast loading
- **Lazy Loading** - Components load on demand
- **Real-time Updates** - Efficient data synchronization
- **Caching** - Browser and database caching

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 👨‍💻 **Developer**

**Oum Hind F. Douirani**

- **Email:** omhind53@gmail.com
- **GitHub:** [@Amddah21](https://github.com/Amddah21)

## 🆘 **Support**

For support, email omhind53@gmail.com or create an issue on GitHub.

---

**Built with ❤️ for art lovers everywhere** 🎨✨
