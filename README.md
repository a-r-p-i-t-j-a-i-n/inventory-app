# Inventory Management System (IMS)

This is a complete Inventory Management System built using the MERN stack (MongoDB, Express, React, Node.js). The goal of this project is to provide a reliable way for small warehouse administrators to track products, manage stock levels, and monitor inventory movements.

It includes role-based authentication, separating "Admin" users who can modify data from "Viewer" users who have read-only access.

## Features

*   **Role-Based Access Control**: Secure login with JWT. Admins have full access; Viewers are read-only.
*   **Product Management**: Add, edit, and delete products. Includes pagination and search functionality.
*   **Stock Tracking**: Record stock coming in (Purchases) and going out (Sales/Damage). The system prevents stock from going below zero.
*   **Dashboard**: A focused view showing total products, low-stock items, and recent transaction history.
*   **Mobile Optimized**: The interface is fully responsive. It includes a specific layout for mobile devices to ensure data is readable and forms are easy to use on smaller screens.

## Technical Stack

*   **Frontend**: React (Vite), Redux Toolkit for state management, CSS Modules for styling.
*   **Backend**: Node.js with Express.
*   **Database**: MongoDB.
*   **Authentication**: JSON Web Tokens (JWT) and bcrypt for password hashing.

## Setup Instructions

Follow these steps to run the project locally.

### 1. Backend Setup

1.  Open a terminal and navigate to the `backend` folder.
2.  Install the required packages:
    ```bash
    npm install
    ```
3.  Create a file named `.env` in the `backend` folder and add the following configuration:
    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    NODE_ENV=development
    ```
4.  Start the backend server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup

1.  Open a new terminal and navigate to the `frontend` folder.
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the React application:
    ```bash
    npm run dev
    ```
4.  The application will run at `http://localhost:5173`.

## Login Credentials

You can use the following accounts to test the different roles.

**Admin Account** (Full Access)
*   **Username**: admin_user
*   **Password**: password123

**Viewer Account** (Read Only)
*   **Username**: user
*   **Password**: 123456

## Project Structure Notes

*   **Backend**: Follows a Controller-Service pattern. logic is inside the `services` folder to keep the `controllers` clean.
*   **Frontend**: Uses Redux Toolkit Query (RTK Query) for efficient data fetching and caching.
*   **Styling**: We used standard CSS Modules instead of a framework like Tailwind to demonstrate core CSS skills, including Flexbox and responsive media queries.

## Assumptions & Trade-offs

*   **User registration is kept minimal** and intended mainly for testing roles (Admin / Viewer).
*   **JWT authentication is implemented without refresh tokens** to keep the system simple.
*   **Stock movements are recorded as immutable logs** for audit purposes.
*   **Styling is done using CSS Modules** instead of Tailwind to demonstrate core CSS skills.
*   **No payment or order system is included**, as the focus is inventory tracking only.
