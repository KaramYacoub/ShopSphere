# ShopSphere

ShopSphere is a full-stack e-commerce web application built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides a complete online shopping experience with a wide range of features for both customers and administrators.

## Features

- **User Authentication:** Secure user registration and login system with JWT-based authentication.
- **Product Management:** Easily add, edit, and delete products.
- **Shopping Cart:** A fully functional shopping cart that persists across sessions.
- **Wishlist:** Users can save their favorite products to a wishlist.
- **Checkout Process:** A smooth and intuitive multi-step checkout process.
- **Order Management:** Users can view their order history and track their orders.
- **Search and Filter:** Powerful search and filtering options to find products easily.
- **Responsive Design:** A mobile-first design that looks great on all devices.

## Tech Stack

### Backend

- **Node.js:** A JavaScript runtime for building the server-side application.
- **Express.js:** A web application framework for Node.js.
- **MongoDB:** A NoSQL database for storing product and user data.
- **Mongoose:** An ODM library for MongoDB and Node.js.
- **JWT:** For generating and verifying JSON Web Tokens for authentication.
- **Passport.js:** For authentication, including Google OAuth.
- **Cloudinary:** For cloud-based image and video management.
- **Multer:** For handling `multipart/form-data`, used for uploading files.
- **Nodemailer:** For sending emails.

### Frontend

- **React:** A JavaScript library for building user interfaces.
- **Vite:** A fast build tool and development server for modern web projects.
- **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
- **React Router:** For handling client-side routing.
- **TanStack Query:** For fetching, caching, and updating data in React applications.
- **Axios:** A promise-based HTTP client for the browser and Node.js.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **shadcn/ui:** A collection of reusable UI components.
- **i18next:** An internationalization framework for JavaScript.
- **Zod:** A TypeScript-first schema declaration and validation library.
- **React Hook Form:** For building performant, flexible, and extensible forms.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm installed on your machine.
- A MongoDB database (local or cloud).

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/KaramYacoub/ShopSphere.git
    ```
2.  **Backend Setup**

    - Navigate to the `backend` directory:
      ```sh
      cd backend
      ```
    - Install NPM packages:
      ```sh
      npm install
      ```
    - Create a `.env` file in the `backend` directory and add the following environment variables:

      ```
      PORT=5000
      MONGO_URI=<YOUR_MONGO_URI>
      JWT_SECRET=<YOUR_JWT_SECRET>
      GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
      GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
      GOOGLE_CALLBACK_URL=<YOUR_GOOGLE_CALLBACK_URL>
      EMAIL_USER=<YOUR_EMAIL_USER>
      EMAIL_PASS=<YOUR_EMAIL_PASS>
      FRONTEND_URL=http://localhost:5173
      BACKEND_URL=http://localhost:5000
      CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
      CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
      CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>
      ```

    - Start the backend server:
      ```sh
      npm start
      ```

3.  **Frontend Setup**
    - Navigate to the `frontend` directory:
      ```sh
      cd frontend
      ```
    - Install NPM packages:
      ```sh
      npm install
      ```
    - Create a `.env` file in the `frontend` directory and add the following environment variables:
      ```
      VITE_API_URL=http://localhost:5000/api
      ```
    - Start the frontend development server:
      ```sh
      npm run dev
      ```

## Folder Structure

The project is organized into two main directories: `frontend` and `backend`.

```
ShopSphere/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── ...
│   └── ...
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   └── ...
    └── ...
```
