# Store Rating System

A full-stack application that allows users to submit ratings for stores. The system includes role-based access control with three user types:

1. System Administrator
2. Normal User
3. Store Owner

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication

## Features

- User authentication and role-based access control
- Store management and listing
- Rating submission and display
- Responsive UI with clean, modern design
- Comprehensive form validation
- Interactive dashboards for administrators and store owners

## Getting Started

### Prerequisites

- Node.js 
- PostgreSQL database (or Neon PostgreSQL)

### Installation

1. Clone the repository

2. Install dependencies
```bash
cd client
npm run install
```

```bash
cd server
npm run install
```

3. Configure environment variables
   
   Create a `.env` file in the `server` directory with the following variables:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/storereview?schema=public"
   JWT_SECRET="your-super-secret-jwt-token-that-should-be-longer-than-this"
   PORT=3000
   ```

4. Initialize the database
```bash
cd server
npm run prisma:migrate
```

5. Start the development servers
```bash
npm run dev
```

## User Roles and Permissions

1. **System Administrator**
   - Manage stores, users, and admin users
   - View dashboard statistics
   - Access to all system functionality

2. **Normal User**
   - Sign up and log in
   - Update password
   - Browse stores
   - Submit and modify ratings

3. **Store Owner**
   - View store statistics
   - Monitor ratings for their stores
   - Update store information

