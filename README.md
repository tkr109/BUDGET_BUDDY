# BudgetBuddy

![image](https://github.com/user-attachments/assets/b0013afa-b6c4-41f1-8560-61215bf3b722)


## Overview

BudgetBuddy is a comprehensive expense tracker application built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to add, display, delete, and edit transactions, and visualize their spending habits. The application includes features for creating budgets and sharing transaction reports via email.

## Features

- **Add New Transactions**: Easily add new income or expense transactions.
- **View Transactions**: Display a list of all transactions with details like date, amount, type, category, and description.
- **Filter Transactions**: View transactions based on specific periods: last 1 week, last 1 month, and last 1 year.
- **View by Type**: Filter to view only incomes or only expenses.
- **Edit and Delete Transactions**: Modify or remove existing transactions.
- **Visualize Spending**: View graphical representations of spending habits.
- **Create Budgets**: Set up and manage budgets.
- **Share Reports**: Send transaction summaries to your email for a specified period.
- **User Authentication**: Secure user authentication with password hashing using bcrypt.

## Technologies Used

### Frontend
- **React**: For building the user interface.
- **CSS**: For styling the application.

### Backend
- **Node.js & Express**: For building the server-side logic.
- **MongoDB**: For database management.
- **Mongoose**: For interacting with MongoDB.
- **bcrypt**: For password hashing.
- **jsonwebtoken**: For managing authentication tokens.
- **Nodemailer**: For sending emails.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- MongoDB

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/BudgetBuddy.git
   cd BudgetBuddy


2. Install dependencies for both client and server:

   ```sh
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   Set up environmen
   ```

3. Set up environment variables:
   Create a .env file in the server directory and add the following:
   ```sh
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password
   ```
4. Run the application:
   ```sh
   # Run server
   cd server
   npm start

   # Run client
   cd ../client
   npm start
   ```
The server will start on http://localhost:5000 and the client on http://localhost:3000.

## Usage

- **Sign Up / Log In**: Create an account or log in to access your personal budget dashboard.
- **Add Transactions**: Use the "Add New" button to input new income or expense entries.
- **Manage Transactions**: Edit or delete transactions directly from the list.
- **Filter Transactions**: Use the dropdown menu to filter transactions by last 1 week, last 1 month, or last 1 year.
- **View by Type**: Toggle between viewing only incomes or only expenses.
- **Visualize Spending**: Switch to the graph view to see a visual representation of your spending.
- **Create Budget**: Click on "Create Budget" to set up a new budget.
- **Share Reports**: Use the "Share Report" button to email a summary of your transactions.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any changes.

