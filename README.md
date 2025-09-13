# 🏠 Haven - Travel Accommodation Platform

A full-stack web application for discovering and booking unique travel accommodations, built with modern web technologies.

## 🌐 Live Demo

**🔗 https://haven-wheat.vercel.app/listings**

## ✨ Features

- 🏡 **Property Listings** - Browse unique accommodations by category
- 🔍 **Smart Search** - Find properties by location, price, and preferences  
- 🗺️ **Interactive Maps** - Explore property locations with MapTiler integration
- 👤 **User Authentication** - Secure registration and login system
- ⭐ **Reviews & Ratings** - 5-star rating system with user reviews
- 📱 **Responsive Design** - Mobile-first approach with Bootstrap
- 🖼️ **Image Upload** - Cloudinary integration for optimized image storage
- 💰 **Dynamic Pricing** - Toggle between prices with/without taxes
- 🔐 **Secure Authorization** - Role-based access control for property owners

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Passport.js** - Authentication middleware

### Frontend  
- **EJS** - Templating engine with EJS-Mate
- **Bootstrap 5** - Responsive CSS framework
- **JavaScript ES6+** - Modern client-side functionality
- **Font Awesome** - Icon library

### Cloud Services
- **MongoDB Atlas** - Cloud database hosting
- **Cloudinary** - Image storage and optimization
- **MapTiler** - Maps and geocoding services
- **Vercel** - Deployment platform

### Additional Tools
- **Joi** - Data validation
- **Multer** - File upload handling
- **Method Override** - HTTP method support
- **Express Session** - Session management
- **Connect Flash** - Flash messaging

## 🚀 Getting Started

### Prerequisites
- Node.js (v22.x or higher)
- MongoDB (local or Atlas account)
- Cloudinary account
- MapTiler API key

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   ATLASDB_URL=your_mongodb_connection_string
   
   # Cloudinary
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key  
   CLOUD_API_SECRET=your_cloudinary_api_secret
   
   # MapTiler
   MAPTILER_API_KEY=your_maptiler_api_key
   
   # Session
   SECRET=your_session_secret
   ```

3. **Start the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

4. **Visit the app**
   Open [http://localhost:8080](http://localhost:8080) in your browser

## 📁 Project Structure

```
Haven/
├── app.js                 # Main application file
├── package.json          # Dependencies and scripts
├── middleware.js         # Custom middleware functions
├── schema.js            # Joi validation schemas
├── cloudconfig.js       # Cloudinary configuration
├── controllers/         # Business logic controllers
├── models/             # Database models (Mongoose schemas)  
├── routes/             # Express route definitions
├── views/              # EJS templates and layouts
├── public/             # Static assets (CSS, JS, images)
└── utils/              # Utility functions
```

## 🎨 Key Features Showcase

### Property Management
- Create, read, update, delete property listings
- Image upload with automatic optimization
- Location geocoding for map integration
- Category-based organization

### User Experience
- Intuitive search and filtering
- Interactive property maps
- Mobile-responsive design
- Real-time form validation

### Security
- Password hashing and secure authentication
- Session management with MongoDB store
- Input validation on client and server
- Protected routes with authorization middleware

## 🚀 Deployment

This project is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/abdulsami-1/HAVEN/issues).

## 📝 License

This project is for educational and portfolio purposes.

## 👨‍💻 Author

**Abdul Sami**
- GitHub: [@abdulsami-1](https://github.com/abdulsami-1)

## 🙏 Acknowledgments

- Design inspiration from modern travel platforms
- Icons by Font Awesome
- Maps powered by MapTiler
- Images hosted on Cloudinary

---

⭐ **Star this repository if you found it helpful!**
