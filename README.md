
# Thrift Store - Premium Street Footwear Platform

Thrift Store (Drip Mtaani) is a complete e-commerce management platform that combines a public-facing storefront with a private admin dashboard. It allows businesses to showcase authentic footwear, publish blog posts, manage client testimonials, and handle orders via WhatsApp and M-Pesa — all without any technical help.

## Features

### Public Website
- **Homepage** – High-converting landing page with hero section, category filters, trending products, and call-to-action.
- **Collections/Categories** – Browse shoes by category (Sneakers, Timberland, Office Shoes) with dynamic filtering and search.
- **Products** – Detailed product pages with HD image galleries, size selectors, and real-time stock availability.
- **Cart Drawer** – Seamless slide-out cart with quantity controls, delivery fee calculation, and subtotal summary.
- **Checkout** – Integrated checkout form that captures delivery details, supports M-Pesa payment instructions, and sends orders directly to WhatsApp.
- **Blogs** – Read articles about sneaker culture, styling tips, and store updates.
- **Testimonials** – Read feedback from satisfied clients.
- **Contact** – Enquire via WhatsApp, call, or contact form.

### Admin Dashboard
- **Product Management** – Add, edit, and delete shoes with up to 4 images, sizes, pricing, and badges (e.g., "Best Seller").
- **Inventory Management** – Track stock levels for specific shoe sizes.
- **Blog Management** – Write and publish blog posts with cover images and keywords.
- **Testimonials Management** – Collect and display client feedback.
- **Secure Authentication** – Login with email and password, protected by JWT and HTTP-only cookies.
- **User Profile** – View and manage admin profile.
- **Dark Mode** – Built-in theme toggle for the dashboard.

### Technical Features
- **Responsive Design** – Mobile-first architecture that works perfectly on desktop, tablet, and mobile.
- **SEO Optimized** – Dynamic meta tags via React Helmet, Open Graph tags, and clean URLs.
- **Cloud Image Upload** – Secure image uploading to Cloudinary, with automatic resizing.
- **WhatsApp Checkout** – Orders are formatted and sent directly to the business owner's WhatsApp.
- **M-Pesa Integration** – Clear payment instructions using the business Paybill and Account number.
- **Secure Authentication** – JWT with HTTP-only cookies and password reset via email OTP.

## Technologies Used

### Frontend
- **React** – UI library for building the user interface
- **Vite** – Build tool for fast development and production builds
- **React Router** – Client-side routing
- **React Icons** – Icon library for UI components
- **React Helmet Async** – Dynamic SEO meta tags

### Backend
- **Node.js** – JavaScript runtime for the backend
- **Express.js** – Web framework for building APIs
- **MongoDB & Mongoose** – NoSQL database for scalable data storage
- **JWT** – Authentication via JSON Web Tokens
- **bcryptjs** – Password hashing for security
- **Multer** – Image upload handling (memory storage)
- **Cloudinary** – Cloud storage for product and blog images
- **Cookie Parser** – Parse cookies for authentication

## Data Flow

### Product Management
1. Admin adds a product via the dashboard.
2. The frontend sends a `multipart/form-data` request to the backend.
3. Multer processes the image buffers in memory.
4. Images are uploaded to Cloudinary, returning secure URLs.
5. Product data (including Cloudinary URLs) is saved to the MongoDB `products` collection.
6. The product appears on the public storefront instantly.

### Checkout & Orders
1. Customer adds shoes to the cart (managed globally via React Context/Outlet Context).
2. Customer fills out the checkout form (Name, Phone, Location, Payment Method).
3. On submission, the frontend formats a detailed order message.
4. The order is sent to the business's WhatsApp via a `wa.me` link.
5. The order is also logged to the backend via `POST /api/orders` for record-keeping.

### User Authentication
1. Admin logs in with email and password.
2. Backend validates credentials against the MongoDB `users` collection.
3. JWT token is generated and stored in an HTTP-only cookie.
4. User is redirected to the dashboard.
5. Subsequent requests are authenticated via the cookie.

## API Endpoints

### Public Endpoints
- `GET /api/products` – Fetch all products (supports `?category=` filter)
- `GET /api/products/:id` – Fetch a single product
- `GET /api/categories` – Fetch all product categories
- `GET /api/blogs` – Fetch all blog posts
- `GET /api/testimonials` – Fetch all testimonials
- `GET /api/config` – Fetch public config (WhatsApp number, M-Pesa details)
- `GET /api/health` – Health check

### Protected Endpoints (Requires Authentication)
- `POST /api/products` – Add new product
- `PUT /api/products/:id` – Update product
- `DELETE /api/products/:id` – Delete product
- `POST /api/blogs` – Add new blog
- `PUT /api/blogs/:id` – Update blog
- `DELETE /api/blogs/:id` – Delete blog
- `POST /api/testimonials` – Add new testimonial
- `PUT /api/testimonials/:id` – Update testimonial
- `DELETE /api/testimonials/:id` – Delete testimonial

### Authentication Endpoints
- `POST /api/register` – Register new admin
- `POST /api/login` – Login user
- `GET /api/profile` – Get user profile
- `POST /api/logout` – Logout user

### Password Reset Endpoints
- `POST /api/reset/send-otp` – Send OTP for password reset
- `POST /api/reset/verify-otp` – Verify OTP
- `POST /api/reset/reset-password` – Reset password

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend root and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   WHATSAPP_NUMBER=254789679161
   MPESA_PAYBILL=400200
   MPESA_ACCOUNT=25479396676801
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend root:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_WHATSAPP_NUMBER=254789679161
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Folder Structure

```text
thrift-store/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── blogController.js
│   │   ├── productController.js
│   │   ├── testimonialController.js
│   │   ├── configController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Blog.js
│   ├── routes/
│   │   ├── authRoute.js
│   │   ├── blogRoute.js
│   │   ├── productRoute.js
│   │   ├── testimonialRoute.js
│   │   ├── configRoute.js
│   │   └── orderRoute.js
│   ├── utils/
│   │   ├── cloudinary.js
│   │   ├── sendEmail.js
│   │   └── uploadToCloudinary.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── jsx/
│   │   │   │   │   ├── Dashboard.jsx
│   │   │   │   │   ├── ProductManage.jsx
│   │   │   │   │   ├── BlogManage.jsx
│   │   │   │   │   ├── Inventory.jsx
│   │   │   │   │   └── TestimonialsManage.jsx
│   │   │   │   └── css/
│   │   │   ├── landingpage/
│   │   │   │   ├── jsx/
│   │   │   │   │   ├── Navbar.jsx
│   │   │   │   │   ├── Footer.jsx
│   │   │   │   │   ├── Hero.jsx
│   │   │   │   │   ├── Categories.jsx
│   │   │   │   │   ├── Products.jsx
│   │   │   │   │   ├── CategoryPage.jsx
│   │   │   │   │   ├── ProductDetail.jsx
│   │   │   │   │   ├── Checkout.jsx
│   │   │   │   │   ├── Cart.jsx
│   │   │   │   │   └── Contact.jsx
│   │   │   │   └── css/
│   │   │   └── SEO/
│   │   │       └── Seo.jsx
│   │   ├── layouts/
│   │   │   └── PublicLayout.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   ├── utils/
│   │   │   └── CartUtil.js
│   │   ├── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## How Data Flows in Thrift Store

The Thrift Store platform operates on a modern MERN (MongoDB, Express, React, Node) stack architecture. All data is stored securely in a MongoDB database. When a visitor views the public website, the frontend makes API calls to the backend, which queries MongoDB and returns the data as JSON. 

For example, when someone visits a specific category, a `GET` request is sent to `/api/products?category=sneakers`, the backend queries the database, and the products are displayed as cards. All public content is fetched dynamically, ensuring that any update made through the admin dashboard (like a price change or a new shoe) appears instantly on the live site.

Images are handled via Cloudinary. When an admin uploads an image, the backend streams it to Cloudinary and stores the resulting URL in MongoDB. Authentication is managed via JWT tokens stored in HTTP-only cookies, ensuring that only authorized users can access the admin dashboard. This highly scalable data flow means you have full control over your e-commerce store without needing to touch a single line of code.

## Live Demo & Contact

**🔗 Live Site:** https://thriftstore.co.ke

**📧 Email:** simonmbithi143@gmail.com  
**📱 Phone:** +254789679161

Feel free to explore the platform and get in touch if you have any questions or would like to discuss a project.
```
