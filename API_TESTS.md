# API Test Cases & Documentation

This file contains detailed test cases for every API endpoint in the Inventory Management System. You can use **Postman** or **cURL** to run these tests.

## 1. Authentication

### A. Register Admin (Seed)
*Description*: Create a new Admin user.
*Method*: `POST`
*Endpoint*: `/api/auth/register`

**Request Body**:
```json
{
  "username": "admin_user",
  "password": "password123",
  "role": "admin"
}
```

**cURL**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin_user", "password": "password123", "role": "admin"}'
```

**Expected Response (201 Created)**:
```json
{
  "_id": "...",
  "username": "admin_user",
  "role": "admin",
  "token": "eyJhbG..."
}
```

### B. Login
*Description*: Login to receive a JWT token.
*Method*: `POST`
*Endpoint*: `/api/auth/login`

**Request Body**:
```json
{
  "username": "admin_user",
  "password": "password123"
}
```

**cURL**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin_user", "password": "password123"}'
```

**Save the Token**: You will need the `token` from the response for subsequent requests.

---

## 2. Product Management (Admin Only)

**Header Requirement**: `Authorization: Bearer <YOUR_TOKEN>`

### A. Create Product
*Description*: Add a new product to inventory.
*Method*: `POST`
*Endpoint*: `/api/products`

**Request Body**:
```json
{
  "name": "Wireless Mouse",
  "sku": "WM-001",
  "category": "Electronics",
  "price": 25.99,
  "lowStockThreshold": 10,
  "description": "Ergonomic wireless mouse"
}
```

**cURL**:
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{"name": "Wireless Mouse", "sku": "WM-001", "category": "Electronics", "price": 25.99, "lowStockThreshold": 10, "description": "Ergonomic wireless mouse"}'
```

### B. Get All Products
*Description*: List products with pagination.
*Method*: `GET`
*Endpoint*: `/api/products?pageNumber=1&keyword=`

**cURL**:
```bash
curl -X GET "http://localhost:5000/api/products?pageNumber=1" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### C. Update Product
*Description*: Update details of a product.
*Method*: `PUT`
*Endpoint*: `/api/products/:id` (Replace `:id` with actual product ID)

**Request Body**:
```json
{
  "price": 27.99,
  "description": "Updated description"
}
```

### D. Delete Product
*Description*: Remove a product.
*Method*: `DELETE`
*Endpoint*: `/api/products/:id`

---

## 3. Stock Management (Admin Only)

**Header Requirement**: `Authorization: Bearer <YOUR_TOKEN>`

### A. Stock IN (Purchase)
*Description*: Increase stock level.
*Method*: `POST`
*Endpoint*: `/api/stock`

**Request Body**:
```json
{
  "productId": "<PRODUCT_ID>",
  "type": "IN",
  "quantity": 50,
  "reason": "Restock Order #101"
}
```

**cURL**:
```bash
curl -X POST http://localhost:5000/api/stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{"productId": "<PRODUCT_ID>", "type": "IN", "quantity": 50, "reason": "Restock"}'
```

### B. Stock OUT (Sale)
*Description*: Decrease stock level.
*Method*: `POST`
*Endpoint*: `/api/stock`

**Request Body**:
```json
{
  "productId": "<PRODUCT_ID>",
  "type": "OUT",
  "quantity": 5,
  "reason": "Customer Sale"
}
```

**Expected Error (if stock low)**: 400 Bad Request if quantity becomes negative.

### C. Get Dashboard Stats
*Description*: View total products, low stock items, and recent movements.
*Method*: `GET`
*Endpoint*: `/api/stock/dashboard`

**cURL**:
```bash
curl -X GET http://localhost:5000/api/stock/dashboard \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```
