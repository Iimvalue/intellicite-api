# Project Setup

Follow the steps below to set up the project:

## Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (or any database you are using)

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repo.git
    ```
2. Navigate to the intellicite-api directory:
    ```bash
    cd intellicite-api
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

## Configuration
1. Change a `.env.example` to `.env` file in the root of the intellicite-api directory.
2. Add the following environment variables:
    ```env
    PORT=3000
    DATABASE_URL=your-database-url
    ```

## Running the Project
1. Start the development server:
    ```bash
    npm run dev
    ```
2. The server should now be running at `http://localhost:3000`.

## Folder Structure
```
backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
├── tests/
├── .env
├── package.json
└── README.md
```