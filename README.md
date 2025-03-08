# Twitter Clone

This project is a full-stack Twitter clone application with a React frontend and Node.js backend.

## Prerequisites

Before getting started, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [React](https://reactjs.org/) (v17 or higher)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/cmn22/twitter-clone.git
cd twitter-clone
```

### 2. Set Up the Backend

First, make sure PostgreSQL is installed and running with the following configuration:

- Username: postgres
- Password: core%4052
- Database: twitter

Then, install and run the backend:

PS: .env.example have been added so you can create your own .env and fill the empty fields

```bash
# Navigate to the API directory
cd api

# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Seed the database with initial data
npx prisma db seed

# Start the backend server
npm start
```

The API server should now be running on http://localhost:5001 (or another port specified in your environment).

### 3. Set Up the Frontend

Open a new terminal window/tab and run:

```bash
# Navigate to the client directory from the project root
cd client

# Install dependencies
npm install

# Start the frontend development server
npm start
```

Your default web browser should automatically open and navigate to http://localhost:3000, where you can interact with the application.

## Using the Application

1. The application will open automatically in your browser
2. Sign up for a new account
3. Test the various functionalities:
   - Creating tweets
   - Following other users
   - Liking and retweeting
   - Viewing profiles
   - And more!

## Troubleshooting

If you encounter any issues:

- Make sure PostgreSQL is properly installed and running
- Check that the database credentials are correct
- Ensure all dependencies are installed
- Verify that ports 3000 and 5002 are not being used by other applications

## Project Structure

- `/api` - Backend Node.js server with Prisma ORM
- `/client` - Frontend React application
