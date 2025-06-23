# 🛍️ Buyzzle - Modern E-commerce Platform

> **A sophisticated full-stack e-commerce solution by TEAM AJ**  
> Supported by University Incubation Centre

![Platform Preview](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)

## 🌟 Overview

Buyzzle is a cutting-edge e-commerce platform that combines modern web technologies with innovative features to deliver an exceptional shopping experience. Built as a student startup project under university incubation, it showcases the power of youth entrepreneurship and technical excellence.

## ✨ Key Features

### 🛒 **Core E-commerce Functionality**
- **Product Catalog** - Browse products with advanced filtering and search
- **Shopping Cart** - Persistent cart with local storage
- **Wishlist System** - Save favorite products for later
- **Product Reviews** - Customer feedback and ratings system
- **Responsive Design** - Optimized for all devices

### 🎯 **Advanced Features**
- **Dark/Light Mode** - User preference with system detection
- **Product Recommendations** - AI-powered suggestions
- **Trending Products** - Real-time popularity tracking
- **Product Analytics** - View tracking and engagement metrics
- **Admin Dashboard** - Comprehensive management interface

### 🚀 **Innovative Capabilities**
- **Real-time Search** - Debounced search with instant results
- **Smart Filtering** - Multi-criteria product filtering
- **Quick View** - Product preview without navigation
- **Visual Feedback** - Toast notifications and loading states
- **SEO Optimized** - Meta tags and social sharing ready

## 🏗️ Technical Architecture

### **Frontend Stack**
```
React 18 + TypeScript
├── UI Framework: Radix UI + shadcn/ui
├── Styling: Tailwind CSS with custom design system
├── State Management: TanStack Query for server state
├── Routing: Wouter (lightweight client-side routing)
├── Forms: React Hook Form + Zod validation
└── Icons: Font Awesome + Lucide React
```

### **Backend Stack**
```
Node.js + Express.js + TypeScript
├── Database: PostgreSQL with Drizzle ORM
├── Database Provider: Neon Serverless PostgreSQL
├── API Design: RESTful endpoints
├── Session Management: Express sessions
└── Validation: Zod schemas
```

### **Development Tools**
```
Build System: Vite
├── TypeScript: Full type safety
├── Hot Reload: Backend and frontend
├── Database Migrations: Drizzle Kit
└── Package Management: npm
```

## 📊 Database Schema

### **Core Tables**
| Table | Purpose | Key Features |
|-------|---------|--------------|
| `users` | User management | Authentication, roles |
| `products` | Product catalog | Categories, stock, pricing |
| `cart_items` | Shopping cart | User-specific cart items |
| `wishlist` | Saved products | User favorites |
| `reviews` | Product feedback | Ratings, comments |
| `feedback` | Customer support | Contact form messages |
| `product_views` | Analytics | View tracking, trending |

### **Database Setup**

#### **Prerequisites**
- PostgreSQL 16+ installed
- Node.js 20+ installed
- npm package manager

#### **Environment Variables**
```env
DATABASE_URL=postgresql://username:password@hostname:port/database
PGHOST=your_host
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=buyzzle
```

#### **Database Initialization**
```bash
# 1. Clone the repository
git clone https://github.com/team-aj/buyzzle.git
cd buyzzle

# 2. Install dependencies
npm install

# 3. Setup database schema
npm run db:push

# 4. (Optional) Seed with sample data
npm run db:seed
```

#### **Database Migrations**
```bash
# Generate migrations after schema changes
npm run db:generate

# Apply migrations to database
npm run db:push

# View database studio (optional)
npm run db:studio
```

## 🚀 Installation & Setup

### **Quick Start**
```bash
# Clone repository
git clone https://github.com/team-aj/buyzzle.git
cd buyzzle

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
npm run db:push

# Start development server
npm run dev
```

### **Production Deployment**
```bash
# Build for production
npm run build

# Start production server
npm start
```

### **Available Scripts**
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Generate migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run type-check` | Run TypeScript checks |

## 📱 API Documentation

### **Product Endpoints**
```typescript
GET    /api/products              // Get all products
GET    /api/products/featured     // Get featured products
GET    /api/products/trending     // Get trending products
GET    /api/products/recommended  // Get AI recommendations
GET    /api/products/search?q=    // Search products
GET    /api/products/:id          // Get single product
POST   /api/products/:id/view     // Track product view
POST   /api/products              // Create product (admin)
PUT    /api/products/:id          // Update product (admin)
DELETE /api/products/:id          // Delete product (admin)
```

### **User Endpoints**
```typescript
POST   /api/admin/login           // Admin authentication
GET    /api/admin/stats           // Dashboard statistics
POST   /api/feedback              // Submit contact form
GET    /api/feedback              // Get all feedback (admin)
```

### **Request/Response Examples**

#### **Get Products**
```typescript
// Request
GET /api/products?category=Electronics&limit=10

// Response
{
  "products": [
    {
      "id": 1,
      "name": "iPhone 15 Pro",
      "description": "Latest Apple smartphone...",
      "price": "999.99",
      "category": "Electronics",
      "imageUrl": "https://...",
      "stock": 50,
      "featured": true,
      "active": true,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### **Submit Feedback**
```typescript
// Request
POST /api/feedback
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "general",
  "message": "Great platform!"
}

// Response
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "general",
  "message": "Great platform!",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

## 🎨 Design System

### **Color Palette**
```css
/* Primary Colors */
--primary: hsl(249, 83%, 65%)      /* Brand Purple */
--secondary: hsl(259, 83%, 70%)    /* Accent Purple */

/* Semantic Colors */
--success: hsl(142, 71%, 45%)      /* Green */
--warning: hsl(43, 96%, 56%)       /* Yellow */
--destructive: hsl(0, 84%, 60%)    /* Red */

/* Neutral Colors */
--background: hsl(0, 0%, 100%)     /* White */
--foreground: hsl(20, 14%, 4%)     /* Dark Gray */
--muted: hsl(60, 5%, 96%)          /* Light Gray */
```

### **Typography**
```css
/* Font Family */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Font Weights */
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### **Component Variants**
- **Buttons**: Primary, Secondary, Outline, Ghost, Link
- **Cards**: Default, Featured, Interactive
- **Badges**: Default, Secondary, Destructive, Outline
- **Inputs**: Default, Error, Success states

## 🔧 Configuration

### **Environment Variables**
```env
# Database Configuration
DATABASE_URL=postgresql://user:pass@host:port/db
PGHOST=localhost
PGPORT=5432
PGUSER=buyzzle
PGPASSWORD=your_password
PGDATABASE=buyzzle

# Application Configuration
NODE_ENV=development
PORT=5000

# Session Configuration
SESSION_SECRET=your_session_secret

# Admin Credentials (Demo)
ADMIN_EMAIL=admin@buyzzle.com
ADMIN_PASSWORD=admin123
```

### **TypeScript Configuration**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "strict": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  }
}
```

## 🚀 Future Enhancements

### **Planned Features**
- [ ] **AI Shopping Assistant** - ChatGPT integration for product help
- [ ] **Smart Recommendations** - Machine learning product suggestions  
- [ ] **Dynamic Pricing** - AI-powered price optimization
- [ ] **Inventory Management** - Real-time stock tracking
- [ ] **Payment Integration** - Stripe/PayPal checkout
- [ ] **Order Management** - Full order lifecycle
- [ ] **Multi-language Support** - i18n implementation
- [ ] **Mobile App** - React Native companion

### **Technical Improvements**
- [ ] **Performance Optimization** - Code splitting, lazy loading
- [ ] **Testing Suite** - Unit, integration, and E2E tests
- [ ] **CI/CD Pipeline** - Automated deployment
- [ ] **Monitoring** - Error tracking and analytics
- [ ] **Security Enhancements** - OAuth, rate limiting
- [ ] **Caching Strategy** - Redis integration
- [ ] **Search Enhancement** - Elasticsearch integration

## 👥 Team

### **TEAM AJ**
**Founded by:** Amandeep Singh Jadhav  
**Supported by:** University Incubation Centre

| Role | Contributor | Contact |
|------|-------------|---------|
| **Founder & CEO** | Amandeep Singh Jadhav | [LinkedIn](https://linkedin.com/in/amandeep-jadhav) |
| **Technical Lead** | Sarah Chen | [GitHub](https://github.com/sarah-chen) |
| **Product Manager** | Michael Rodriguez | [LinkedIn](https://linkedin.com/in/michael-rodriguez) |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Documentation**: [Wiki](https://github.com/team-aj/buyzzle/wiki)
- **Issues**: [GitHub Issues](https://github.com/team-aj/buyzzle/issues)
- **Discussions**: [GitHub Discussions](https://github.com/team-aj/buyzzle/discussions)
- **Email**: contact@buyzzle.com

## 🌟 Acknowledgments

- **University Incubation Centre** for mentorship and support
- **Open Source Community** for the amazing tools and libraries
- **Replit Platform** for hosting and development environment
- **Contributors** who helped make this project possible

---

<div align="center">

**Built with ❤️ by TEAM AJ**

[Website](https://buyzzle.replit.app) • [Documentation](https://github.com/team-aj/buyzzle/wiki) • [Support](mailto:contact@buyzzle.com)

</div>