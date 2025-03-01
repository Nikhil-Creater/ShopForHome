**ShopForHome - E-Commerce Web Application**

ShopForHome is a fully functional e-commerce web application for home décor products. Built using Angular 19 for the front end and .NET 6.0 Web API for the back end, it offers a seamless shopping experience with advanced features for users and admins.

**User Features:**
1) Browse and filter products by category
2) Add products to cart and update quantity
3) Apply discount coupons at checkout
4) Complete orders successfully with order tracking
5) Wishlist functionality for favorite items
6) Secure user authentication with JWT integration

**Admin Features:**
1) Manage Users (Add/Delete Users)
2) Manage Products (CRUD Operations)
3) View Sales Reports
4) Manage Discount Coupons (Add/Delete)
5) Stock Tracking and Bulk Upload of Products

**Tech Stack:**
1) Frontend: Angular 19, Bootstrap
2) Backend: .NET 6.0 Web API
3) Database: SQL Server
4) Authentication: JWT Token Authentication
5) Deployment: Firebase Hosting / AWS Amplify (for frontend), Azure / AWS / DigitalOcean (for backend)

   

**Installation & Setup**

**Backend Setup (.NET 6.0 Web API)**
   
Clone the repository:
git clone https://github.com/Nikhil-Creater/ShopForHome-API.git
cd ShopForHome-API

Install dependencies:
dotnet restore
Configure the database connection in appsettings.json

Apply migrations and seed data:
dotnet ef database update

Run the API:
dotnet run

**Frontend Setup (Angular 19)**

Clone the repository:
git clone https://github.com/Nikhil-Creater/ShopForHome-Angular.git
cd ShopForHome-Angular

Install dependencies:
npm install
Configure the API URL in environment.ts

Start the development server:
ng serve

**API Endpoints**

POST /api/auth/register - User Registration

POST /api/auth/login - User Login (JWT Authentication)

GET /api/products - Get All Products

POST /api/cart/add - Add Item to Cart

POST /api/orders - Place Order

GET /api/admin/reports - View Sales Reports (Admin Only)

**Contributing**

Contributions are welcome! Feel free to fork the repository and submit a pull request.

**License**

This project is licensed under the MIT License.

**Contact & Support**

For any queries, reach out via GitHub Issues or email at nparsurampuria@gmail.com

**Developed by: [Nikhil-Creater]GitHub: https://github.com/Nikhil-Creater**
