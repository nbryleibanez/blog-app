# Blog App

Welcome to the Blog App! This application is built using **Next.js** for the frontend and **Flask** for the backend. It serves as a technical exam project demonstrating full-stack development capabilities.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Database Setup](#database-setup)
- [License](#license)

## Features

- User authentication (registration and login)
- Create, read, update, and delete blog posts
- Commenting functionality on blog posts

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (version 14.x or higher) installed on your machine.
- **Docker** and **Docker Compose** installed to run the backend services.
- Basic knowledge of using command line interfaces.

## Getting Started

### Frontend

1. **Navigate to the Frontend Directory**:
   ```bash
   cd frontend
   ```

2. Install Dependencies (if running for the first time):
  ```bash
  npm install
  ```

3. Run the Frontend:
  ```bash
  npm run dev
  ```

  The frontend should now be running at http://localhost:3000.


### Backend

1. Navigate to the Backend Directory:
  ```bash
  cd backend
  ```

2. Run with Docker Compose:
  ```bash
  docker-compose -f docker-compose.dev.yml up --build -d
  ``` 

### Database Setup
  If this is your first time running the backend, you need to set up the database:

1. Initialize the Database:
  ```bash
  docker-compose -f docker-compose.dev.yml exec web flask db init
  ```

2. Run Migrations:
  ```bash
  docker-compose -f docker-compose.dev.yml exec web flask db upgrade
  ```

This will create the necessary database tables for your application.
