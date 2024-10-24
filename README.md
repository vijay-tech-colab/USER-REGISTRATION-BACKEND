# Registration Form Project

The **Registration Form** project is a web application that allows users to create accounts by providing their personal information. This application uses **Node.js** and **Express** for backend development and features robust authentication and data management.

## Key Features

- **User Registration**: Sign up with username, email, and password.
- **Form Validation**: Validate inputs to ensure data integrity and prevent errors.
- **Password Security**: Passwords are hashed using **bcrypt** before storage.
- **JWT Authentication**: Secure authentication with JSON Web Tokens (JWT).
- **File Uploads**: Users can upload profile pictures using **Cloudinary**.
- **Cookie Management**: Use **cookie-parser** for handling cookies.
- **RESTful API**: Follow REST principles for clear and organized API endpoints.
- **Error Handling**: Comprehensive error handling for user inputs and authentication.

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing user information.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB.
- **bcrypt**: Library to hash passwords for secure storage.
- **jsonwebtoken**: Library for creating and verifying JSON Web Tokens.
- **cookie-parser**: Middleware for parsing cookies attached to the client request object.
- **Cloudinary**: Cloud-based service for managing and delivering images used for file uploads.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (or a MongoDB Atlas account for cloud hosting)

### Installation Steps

1. **Clone the repository** from GitHub:
   ```bash
   git clone https://github.com/vijay-tech-colab/registration-form.git

  Navigate to the project directory:

bash
Copy code
cd registration-form
Install dependencies:

bash
Copy code
npm install
Set up your MongoDB database:

Create a MongoDB database and update your connection string in the .env file.
Configure environment variables:

Create a .env file in the root directory and add the following:
env
Copy code
PORT=3000
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_URL=your_cloudinary_url
Start the server:

bash
Copy code
npm start
Access the registration form via your web browser at http://localhost:3000 (or your specified port).

API Endpoints
1. Register a New User
Endpoint: POST /api/register

Request Body:

json
Copy code
{
  "username": "exampleUser",
  "email": "user@example.com",
  "password": "yourPassword",
  "profileImage": "file" // for the file upload
}
Response:

201 Created: User registered successfully.
400 Bad Request: Validation errors or user already exists.
2. User Login
Endpoint: POST /api/login

Request Body:

json
Copy code
{
  "email": "user@example.com",
  "password": "yourPassword"
}
Response:

200 OK: Returns a JWT token.
401 Unauthorized: Invalid credentials.
