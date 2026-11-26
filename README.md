# Smart Agricultural Marketplace and Farm Supply Chain Management System (Backend API)

A RESTful backend prototype built with **NestJS**, **TypeORM**, **MySQL**, and **JWT Authentication** for **ITEC 116 — Systems Integration and Architecture 2**. The platform connects local farmers directly with produce buyers and system administrators to manage produce listings, purchase orders, line items, and digital payments.

## Tech Stack
- **Backend Framework:** NestJS (Node.js / TypeScript)
- **ORM:** TypeORM
- **Database:** MySQL (via XAMPP)
- **Authentication & Security:** JWT (@nestjs/jwt, passport-jwt), crypt password hashing, Role-Based Access Control (RolesGuard), and class-validator DTO validation
- **API Testing:** Postman

## Database Schema
- users — Stores Farmer, Buyer, and Admin accounts with hashed passwords
- products — Agricultural produce listings linked to Farmers (1:M)
- orders — Buyer purchase orders (1:M)
- order_items — Individual product line items per order (1:M)
- payments — Payment records linked 1-to-1 with orders (1:1)

## Local Setup & Installation
1. **Clone the repository:**
   `ash
   git clone [https://github.com/Istagah/Smart-Agri-Marketplace.git](https://github.com/Istagah/Smart-Agri-Marketplace.git)
   cd Smart-Agri-Marketplace
   `
2. **Install dependencies:**
   `ash
   npm install
   `
3. **Configure environment variables:** Create a .env file in the root directory and add:
   `env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=
   DB_NAME=smart_agri_db
   PORT=3000
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRES_IN=1d
   `
4. **Start MySQL & Run the Server:**
   - Start **Apache** and **MySQL** in XAMPP and create an empty database named smart_agri_db.
   - Start the NestJS development server:
     `ash
     npm run start:dev
     `
   - Base API URL: http://localhost:3000/api/v1
