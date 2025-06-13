# User Submission Tracker with File Management & Analytics

Welcome to the **User Submission Tracker!** This web application is a backend system built using the MERN stack (MongoDB, Express.js, React.js, Node.js) designed to efficiently manage user submissions, handle file uploads, and provide insightful analytics. It's crafted to offer a robust and scalable solution for tracking various user-submitted information and associated files.

## 🚀 Overview

The primary goal of this project is to demonstrate practical skills in building modern backend applications. It focuses on key areas like robust schema design, efficient data querying with MongoDB aggregations, modular code structure, and comprehensive file handling.

## ✨ Features

This application allows you to:

* **Create Users:** Easily register new users who can then make submissions.
* **Submit Structured Information:** Users can submit forms with various details (e.g., title, description, category).
* **Attach Multiple Files:** Alongside form data, users can upload multiple files, including PDFs and images.
* **Automated File Processing:**
    * Uploaded files are validated and securely stored.
    * Metadata (like image dimensions for images, and page count for PDFs) is automatically extracted and saved.
* **Detailed Submission Views:** Retrieve comprehensive details of any submission, including associated user information and file metadata.
* **Powerful Analytics:**
    * **Top Users Report:** Identify the top 3 users who have made the most submissions.
    * **Files Report:** Get a summarized report of file types (images, PDFs) grouped by submission category.

## 🛠️ Technologies Used

The project leverages a modern and powerful tech stack:

* **Backend:**
    * **Node.js & Express.js:** For building a fast and scalable RESTful API.
    * **MongoDB & Mongoose:** As the NoSQL database and its ODM for seamless data interaction.
    * **Multer:** For efficient handling of multi-part form data, primarily for file uploads.
    * **pdf-parse/pdfjs-dist:** To extract the page count from uploaded PDF documents.
    * **Sharp / image-size:** To determine dimensions (width and height) of uploaded image files.
    * **Joi:** For robust request body validation, ensuring data integrity.
    * **Dotenv:** For managing environment variables securely.
    * **CORS:** Enabled to allow communication between the frontend and backend (if hosted separately, commonly during development).
* **Frontend:**
    * **React.js:** For building a dynamic and responsive user interface (implied by previous discussions about `App.jsx`, `TopUsers.jsx`, etc.).
    * **Axios:** For making HTTP requests to the backend API.

## 📦 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Make sure you have these installed:

* **Node.js** (LTS version recommended)
* **MongoDB** (Community Server or MongoDB Atlas account)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-link-here>
    cd <your-repository-name>
    ```
2.  **Install backend dependencies:**
    Navigate into the `backend` or `mern` (or whatever your backend folder is named) directory:
    ```bash
    cd backend # or cd mern
    npm install
    ```
3.  **Install frontend dependencies:**
    Navigate into the `frontend` or `client` (or whatever your frontend folder is named) directory:
    ```bash
    cd ../frontend # or cd ../client
    npm install
    ```

### Environment Variables

Create a `.env` file in the root of your **backend directory** (e.g., `backend/.env`) and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
UPLOAD_DIR=uploads/ # Directory for storing uploaded files