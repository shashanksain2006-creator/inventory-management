# Inventory Management System API

## Project Overview
A backend REST API developed using Node.js, Express.js and MongoDB to manage inventory products.

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- REST API

## Features
- Create, read, update and delete products (CRUD)
- Search and filter products
- Pagination and sorting
- Restock products
- Sell products with stock validation
- Low-stock alerts
- Category-wise inventory summary
- Input validation and error handling

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/inventoryDB
```

4. Start the server:

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/products | Create product |
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get product by ID |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| PATCH | /api/products/:id/restock | Restock product |
| PATCH | /api/products/:id/sale | Sell product |
| GET | /api/products/low-stock | Get low-stock products |
| GET | /api/products/category-summary | Category summary |

## Server
Default URL: `http://localhost:5000`

## Author
Khushi Arora