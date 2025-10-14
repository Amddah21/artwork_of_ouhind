# ArtSpark Studio Canvas 🎨

A modern, responsive web application showcasing the artwork of Oum Hind F. Douirani, featuring a sophisticated gallery, admin dashboard, and e-commerce functionality.

## 🌟 Features

### 🖼️ **Gallery & Portfolio**

- **Dynamic Artwork Display**: Beautiful masonry-style gallery layout
- **Category Filtering**: Filter by Abstrait, Tableaux, Photographie, and more
- **Artwork Details**: Comprehensive artwork information with stories and techniques
- **Image Protection**: Advanced watermarking and protection features
- **Responsive Design**: Optimized for all devices

### 🎨 **Artwork Management**

- **Admin Dashboard**: Full CRUD operations for artwork management
- **Image Upload**: Support for multiple image formats with preview
- **Artwork Categories**: Organized by techniques and styles
- **Availability Status**: Track artwork availability (Disponible/Indisponible)

### 🔐 **Authentication & Security**

- **Admin Login**: Secure authentication system
- **JWT Tokens**: Token-based authentication
- **Password Reset**: Forgot password functionality
- **Protected Routes**: Secure admin dashboard access

### 📱 **User Experience**

- **Modern UI**: Clean, artistic design with watercolor effects
- **Smooth Animations**: Framer Motion animations throughout
- **Mobile Optimized**: Touch-friendly interface
- **Accessibility**: ARIA labels and keyboard navigation

### 📞 **Contact & Commerce**

- **WhatsApp Integration**: Direct messaging for inquiries
- **Email Contact**: Professional email integration
- **Artwork Inquiries**: Detailed inquiry forms
- **Business Information**: Complete contact details

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (optional - uses mock database by default)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Amddah21/artspark-studio-canvas.git
   cd artspark-studio-canvas
   ```

2. **Install dependencies**

   ```bash
   npm run install:all
   ```

3. **Start the development servers**

   ```bash
   # Option 1: Start both servers with one command
   npm run full-stack

   # Option 2: Start servers individually
   npm run dev          # Frontend (port 8080)
   npm run server:start # Backend (port 3001)

   # Option 3: Use the batch file (Windows)
   start-servers.bat
   ```

4. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3001
   - Admin Dashboard: http://localhost:8080/admin (after login)

## 🎯 Admin Access

### Default Credentials

- **Email**: `omhind53@gmail.com`
- **Password**: `omhind53@`

### Admin Features

- Add/Edit/Delete artworks
- Upload images with preview
- Manage artwork categories
- Set availability status
- View activity logs

## 📁 Project Structure

```
artspark-studio-canvas/
├── src/
│   ├── components/          # React components
│   ├── contexts/           # React contexts
│   ├── pages/              # Page components
│   ├── lib/                # Utilities and config
│   └── styles/             # CSS styles
├── server/
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   ├── database/           # Database setup
│   └── middleware/         # Express middleware
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🛠️ Technology Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Lucide React** for icons

### Backend

- **Express.js** with ES6 modules
- **PostgreSQL** with mock fallback
- **JWT** for authentication
- **Multer** for file uploads
- **bcrypt** for password hashing

### Development Tools

- **ESLint** for code linting
- **TypeScript** for type safety
- **Nodemon** for development
- **Concurrently** for running multiple servers

## 🎨 Artwork Categories

- **Abstrait**: Abstract artworks and mixed media
- **Tableaux**: Traditional paintings
- **Photographie**: Photography and digital art
- **Techniques Mixtes**: Mixed media artworks
- **Portrait**: Portrait paintings
- **Paysage**: Landscape artworks

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Perfect for tablet viewing
- **Desktop Enhanced**: Rich desktop experience
- **Touch Friendly**: Gesture support for mobile

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
PORT=3001
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
```

### API Configuration

The frontend automatically proxies `/api/*` requests to the backend server.

## 📚 Documentation

- [Quick Start Guide](QUICK_START.txt)
- [Database Setup](DATABASE_AND_API_SETUP.md)
- [Architecture Overview](ARCHITECTURE.md)
- [Setup Guide](SETUP_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍🎨 About the Artist

**Oum Hind F. Douirani** is a passionate artist who creates works that capture the essence of beauty and emotion through mixed techniques and vibrant color palettes. With over 40 years of experience, she has created over 200 artworks and participated in 50+ exhibitions.

## 📞 Contact

- **Email**: omhind53@gmail.com
- **WhatsApp**: +212 666 67 27 56
- **Website**: [Your Website URL]

---

Made with ❤️ for showcasing beautiful art to the world.
