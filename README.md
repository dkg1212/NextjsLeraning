# NextAuth Pro - Full-Stack Next.js Authentication

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14+-black.svg?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5+-blue.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License" />
</p>

A production-ready, feature-complete authentication starter kit built with Next.js, TypeScript, and MongoDB. This project provides a secure, interactive, and beautifully designed foundation for any modern web application.

---

## 🚀 Live Demo & Features

Below is a demonstration of the core user interactions, including the dynamic theme, interactive form validation, and error handling.

<p align="center">
  <!-- IMPORTANT: You should create a GIF of your app and replace this placeholder -->
  <img src="https://user-images.githubusercontent.com/10982541/223237199-31189311-53d3-4679-8698-4674a275b283.gif" alt="App Demo GIF" width="800"/>
  <em><br>Demonstration of login page with dynamic dark mode and interactive validation.</em>
</p>

### ✨ Key Features

*   **🔐 Robust Authentication**: Secure user login and registration using JWT (JSON Web Tokens) stored in HTTP-only cookies.
*   **👤 User Management**:
    *   Seamless user registration with server-side validation.
    *   Dynamic user profile page (`/profile`) to view account details.
*   **🎨 Dynamic Theming**:
    *   Beautiful, animated Dark/Light mode toggle.
    *   Theme persists in local storage and respects user's system preference.
    *   Built with a modern CSS variable-driven theme (`globals.css`).
*   **✅ Advanced Form Validation**:
    *   Real-time, in-line validation with icons (`CheckCircle`, `AlertCircle`).
    *   Specific API error messages displayed directly under the relevant input field (e.g., "Invalid password", "User not found").
*   **🚀 Interactive UI/UX**:
    *   Fluid animations on all pages and components, powered by **Framer Motion**.
    *   User-friendly feedback with **React Hot Toast** notifications.
*   **🔑 Secure Password Management**:
    *   Password hashing using **bcryptjs**.
    *   Complete "Forgot Password" and "Reset Password" flow with secure, single-use tokens.
*   **🛡️ Protected Routes**: Middleware-based routing (`middleware.ts`) to protect private pages from unauthenticated users.
*   **✉️ Email Verification**:
    *   Secure account verification via email links (`/verifyemail`).
    *   Built with **Nodemailer** for sending emails (`helpers/mailer.ts`).

## 🛠️ Technology Stack

| Category         | Technology                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| **Framework**    | [Next.js](https://nextjs.org/) (App Router)                                                                  |
| **Language**     | [TypeScript](https://www.typescriptlang.org/)                                                                |
| **Styling**      | [Tailwind CSS](https://tailwindcss.com/)                                                                     |
| **Animation**    | [Framer Motion](https://www.framer.com/motion/)                                                              |
| **Database**     | [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)                                 |
| **Icons**        | [Lucide React](https://lucide.dev/)                                                                          |
| **Notifications**| [React Hot Toast](https://react-hot-toast.com/)                                                              |
| **Auth**         | [JWT](https://jwt.io/), [bcryptjs](https://www.npmjs.com/package/bcryptjs)                                   |
| **Email**        | [Nodemailer](https://nodemailer.com/)                                                                        |

## ⚙️ Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Prerequisites

Make sure you have the following installed:
*   [Node.js](https://nodejs.org/en/) (v18.x or later)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   A [MongoDB](https://www.mongodb.com/try/download/community) database instance (local or a free cloud instance from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register))

### 2. Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project. You can copy the structure from the example below.

### 3. Environment Variables

Create a file named `.env` in the root of the project and add the following variables:

```env
# --- MongoDB Connection ---
# Get this from your MongoDB Atlas dashboard or local instance
MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/<db-name>?retryWrites=true&w=majority

# --- JWT Secret ---
# A long, random, and secret string for signing JWT tokens
# You can generate one here: https://acte.ltd/utils/randomkeygen
TOKEN_SECRET=your_super_secret_jwt_key_here

# --- App Domain ---
# The domain of your application for creating verification links
# For local development:
DOMAIN=http://localhost:3000

# --- Nodemailer (for sending emails) ---
# Use an app-specific password if using Gmail
# See: https://support.google.com/accounts/answer/185833
NODEMAILER_USER=your_email@gmail.com
NODEMAILER_PASS=your_gmail_app_password_here