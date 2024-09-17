# COS30049 NodeJS + Express Backend with API Endpoints

## Project Description

This project is a Node.js and Express backend that provides various API endpoints. It includes routes for authentication and server status, and connects to a MongoDB database.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Run the application:**
   ```sh
   npm start
   ```

## API Endpoints

### Authentication

- **POST /api/auth/login**: User login
- **POST /api/auth/register**: User registration

### Server Status

- **GET /test**: Test connection to server

## TBD

1. **Set up environment variables:**
   Create a `.env` file in the root directory and add the necessary environment variables. For example:

   ```plaintext
   MONGODB_URI=your_mongodb_connection_string
   ```

2. **Error responses to clients with JSON**
   Change anything like <code>res.send(error)</code> to <code>res.json({error: error.message})</code> to send JSON response to clients.

3. **Add more API endpoints**

4. **Serve Pages**

5. **Use JSONWebTokens for session management**
