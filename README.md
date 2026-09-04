# 💼 Expense Voucher Management System

A full-stack **Expense Voucher Management System** developed to digitize the process of creating, submitting, reviewing, approving, rejecting, and monitoring employee expense vouchers.

The system provides role-based access for **Employees, Directors, and Accounts**, ensuring that each user can perform only the operations permitted for their role.

---

## ✨ Features

### 👨‍💼 Employee

* Secure login using JWT authentication
* Create expense vouchers
* Save vouchers as **Draft**
* Upload employee signature
* Submit vouchers for approval
* View only their own vouchers
* View complete voucher details
* Edit only Draft vouchers
* Delete only Draft vouchers
* Track voucher status
* View rejection reason when a voucher is rejected
* Employee dashboard with expense statistics

### 👨‍⚖️ Director / Admin

* Secure Director login
* Director dashboard
* View all expense vouchers
* View pending approvals
* Search, filter, and sort vouchers
* View complete voucher details
* View employee information and employee signature
* Approve vouchers
* Upload Director signature during approval
* Reject vouchers with mandatory rejection reason
* Director dashboard statistics
* Recent voucher activity

### 💰 Accounts

* Secure Accounts login
* View voucher information
* Monitor voucher approval status
* View employee and Director signatures
* Monitor approved expenses
* No permission to create, edit, delete, approve, or reject vouchers

---

## 🔄 Voucher Workflow

```text
             ┌──────────────┐
             │    DRAFT     │
             └──────┬───────┘
                    │
             Employee submits
                    │
                    ▼
        ┌──────────────────────┐
        │  PENDING_APPROVAL    │
        └───────┬────────┬─────┘
                │        │
          Approve        Reject
                │        │
                ▼        ▼
        ┌──────────┐  ┌──────────┐
        │ APPROVED │  │ REJECTED │
        └────┬─────┘  └──────────┘
             │
             ▼
       Accounts Monitoring
```

### Status Rules

| Status             | Description                                           |
| ------------------ | ----------------------------------------------------- |
| `DRAFT`            | Voucher created but not submitted                     |
| `PENDING_APPROVAL` | Submitted by employee and waiting for Director action |
| `APPROVED`         | Approved by Director with Director signature          |
| `REJECTED`         | Rejected by Director with rejection reason            |

---

# 🛠️ Technology Stack

## Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Fetch API

## Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* bcryptjs
* Multer

## Database

* MySQL

## Development Tools

* Visual Studio Code
* MySQL
* Git & GitHub
* npm

---

# 📁 Project Structure

```text
expense-voucher-system/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── voucherController.js
│   │   └── directorController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── voucherRoutes.js
│   │   └── directorRoutes.js
│   │
│   ├── uploads/
│   │
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   └── App.js
│   ├── public/
│   ├── package.json
│   └── ...
│
├── database/
│   └── schema.sql
│
└── README.md
```

> Folder names may vary slightly depending on the final project structure.

---

# 🚀 Project Setup

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd expense-voucher-system
```

---

# 🗄️ Database Setup

### 1. Start MySQL

Make sure your MySQL server is running.

### 2. Create the Database

Open MySQL and run:

```sql
CREATE DATABASE expense_voucher_db;
```

Then select it:

```sql
USE expense_voucher_db;
```

### 3. Run the Database Schema

Execute the provided:

```text
database/schema.sql
```

This creates the required tables and relationships.

---

# ⚙️ Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=expense_voucher_db
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

---

# 💻 Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The frontend will normally run on:

```text
http://localhost:3000
```

---

# 🔐 Authentication & Authorization

The system uses **JWT-based authentication**.

After successful login:

1. User credentials are verified using bcrypt.
2. A JWT token is generated.
3. The token contains the user's ID and role.
4. The token is stored on the frontend.
5. Protected API requests send the token using the `Authorization` header.

Example:

```http
Authorization: Bearer <JWT_TOKEN>
```

## Role-Based Access

| Feature                   | Employee | Director | Accounts |
| ------------------------- | :------: | :------: | :------: |
| Create Voucher            |     ✅    |     ❌    |     ❌    |
| Edit Draft                |     ✅    |     ❌    |     ❌    |
| Delete Draft              |     ✅    |     ❌    |     ❌    |
| Submit Voucher            |     ✅    |     ❌    |     ❌    |
| View Own Vouchers         |     ✅    |     —    |     —    |
| View All Vouchers         |     ❌    |     ✅    |     ✅    |
| Approve Voucher           |     ❌    |     ✅    |     ❌    |
| Reject Voucher            |     ❌    |     ✅    |     ❌    |
| Upload Employee Signature |     ✅    |     ❌    |     ❌    |
| Upload Director Signature |     ❌    |     ✅    |     ❌    |
| View Rejection Reason     |     ✅    |     ✅    |     ✅    |

---

# 📡 API Documentation

Base URL:

```text
http://localhost:5000
```

## 🔑 Authentication APIs

### Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "employee@test.com",
  "password": "your_password"
}
```

### Register

```http
POST /api/auth/register
```

Request:

```json
{
  "name": "Test User",
  "email": "user@test.com",
  "password": "password",
  "role": "EMPLOYEE"
}
```

Supported roles:

```text
EMPLOYEE
DIRECTOR
ACCOUNTS
```

---

# 👨‍💼 Employee APIs

All protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Create Voucher

```http
POST /api/vouchers
```

### Get My Vouchers

```http
GET /api/vouchers/my
```

### Get Employee Dashboard

```http
GET /api/vouchers/dashboard
```

### Get Voucher Details

```http
GET /api/vouchers/:id
```

### Update Draft Voucher

```http
PUT /api/vouchers/:id
```

Only vouchers with status `DRAFT` can be updated.

### Delete Draft Voucher

```http
DELETE /api/vouchers/:id
```

Only vouchers with status `DRAFT` can be deleted.

### Upload Employee Signature

```http
POST /api/vouchers/:id/signature
```

Uses `multipart/form-data`.

Field:

```text
signature
```

### Submit Voucher

```http
PUT /api/vouchers/:id/submit
```

A voucher must have an employee signature before submission.

---

# 👨‍⚖️ Director APIs

All Director endpoints require:

```http
Authorization: Bearer <DIRECTOR_JWT_TOKEN>
```

### Director Dashboard

```http
GET /api/director/dashboard
```

Returns:

* Pending approval count
* Approved today
* Rejected today
* Total pending amount
* Recent activity

### Get Pending Vouchers

```http
GET /api/director/vouchers/pending
```

### Get All Vouchers

```http
GET /api/director/vouchers
```

Supports filtering and sorting through query parameters.

Example:

```text
/api/director/vouchers?status=PENDING_APPROVAL
```

Supported parameters include:

```text
voucher_number
employee_name
department
category
status
start_date
end_date
min_amount
max_amount
sort_by
sort_order
```

### Get Voucher Details

```http
GET /api/director/vouchers/:id
```

### Approve Voucher

```http
PUT /api/director/vouchers/:id/approve
```

Uses:

```text
multipart/form-data
```

Required field:

```text
signature
```

A Director signature is mandatory for approval.

### Reject Voucher

```http
PUT /api/director/vouchers/:id/reject
```

Request:

```json
{
  "rejection_reason": "Travel expense details require clarification."
}
```

A rejection reason is mandatory.

---

# 💰 Accounts APIs

Accounts users are restricted to viewing and monitoring voucher information.

Typical endpoints include:

```http
GET /api/accounts/dashboard
GET /api/accounts/vouchers
GET /api/accounts/vouchers/:id
```

Accounts users cannot:

* Create vouchers
* Edit vouchers
* Delete vouchers
* Approve vouchers
* Reject vouchers

---

# 🗃️ Database Schema

The primary database table is:

## `users`

Stores system users and their roles.

| Column     | Description                    |
| ---------- | ------------------------------ |
| `id`       | Primary key                    |
| `name`     | User's name                    |
| `email`    | Unique email                   |
| `password` | bcrypt hashed password         |
| `role`     | EMPLOYEE / DIRECTOR / ACCOUNTS |

---

## `vouchers`

Stores expense voucher information.

| Column                | Description                   |
| --------------------- | ----------------------------- |
| `id`                  | Primary key                   |
| `voucher_number`      | Unique voucher number         |
| `voucher_date`        | Voucher creation date         |
| `expense_date`        | Date of expense               |
| `department_name`     | Department                    |
| `expense_title`       | Expense title                 |
| `expense_category`    | Expense category              |
| `expense_description` | Expense description           |
| `amount`              | Claimed amount                |
| `employee_id`         | Foreign key referencing users |
| `employee_signature`  | Employee signature path       |
| `director_signature`  | Director signature path       |
| `status`              | Voucher status                |
| `approval_date`       | Director approval date        |
| `rejection_reason`    | Reason for rejection          |
| `created_at`          | Creation timestamp            |
| `updated_at`          | Last update timestamp         |

### Relationship

```text
users
  │
  │ 1
  │
  │
  │ many
  ▼
vouchers
```

Each voucher belongs to one employee through:

```text
vouchers.employee_id → users.id
```

---

# 🧪 Test Users

For development/testing, the project uses role-specific test accounts.

| Role     | Email               |
| -------- | ------------------- |
| Employee | `employee@test.com` |
| Director | `director@test.com` |
| Accounts | `accounts@test.com` |

> Passwords are intentionally not stored in this README. Configure/reset development passwords locally as required.

---

# 🔒 Security Considerations

* Passwords are hashed using **bcryptjs**.
* Authentication uses **JWT**.
* Protected routes require a valid JWT.
* Role-based middleware restricts access to authorized users.
* Employees can access only their own vouchers.
* Employees cannot modify submitted/approved/rejected vouchers.
* Director approval requires a Director signature.
* Voucher rejection requires a rejection reason.
* SQL queries use parameterized values to reduce SQL injection risk.
* Uploaded signatures are handled through Multer.

---

# 📋 Validation Rules

The system validates:

* Department is required.
* Expense title is required.
* Expense date is required.
* Amount is required.
* Amount must be greater than zero.
* Employee signature is required before submission.
* Director signature is required before approval.
* Rejection reason is required when rejecting.
* Only Draft vouchers can be edited or deleted.
* Only pending vouchers can be approved or rejected.

---

# 💡 Assumptions Made During Development

1. **Voucher Number**

   * Voucher numbers are automatically generated by the backend.
   * They are intended to uniquely identify each voucher.

2. **Voucher Status**

   * A newly created voucher starts as `DRAFT`.
   * When an employee submits a voucher, its status becomes `PENDING_APPROVAL`.

3. **Employee Signature**

   * Employee signatures are uploaded as image files.
   * Submission is blocked if the employee signature is missing.

4. **Director Signature**

   * Director signature is uploaded when approving a voucher.
   * Approval is blocked if the signature is missing.

5. **Rejection**

   * A Director must provide a rejection reason.
   * Rejected vouchers are read-only for the employee.

6. **Role Permissions**

   * Access control is enforced using JWT authentication and role-based middleware.

7. **Accounts Role**

   * Accounts is treated as a monitoring role.
   * Accounts users can view approved and other voucher information but cannot modify voucher workflow.

8. **Date Handling**

   * Dates are stored in MySQL and formatted for display on the frontend.

9. **File Storage**

   * Signature files are stored on the backend server during development.
   * File paths are stored in the database.

10. **Development Environment**

* The project is configured for local development using Node.js, React, and MySQL.

---

# 📱 Responsive Design

The frontend is designed with a responsive approach so that voucher information and dashboards can be adapted for different screen sizes.

---

# 🧭 Application Flow

```text
Login
  │
  ├── Employee
  │     ├── Dashboard
  │     ├── Create Voucher
  │     ├── My Vouchers
  │     └── Voucher Details
  │
  ├── Director
  │     ├── Dashboard
  │     ├── Pending Approvals
  │     ├── All Vouchers
  │     └── Voucher Details
  │           ├── Approve + Signature
  │           └── Reject + Reason
  │
  └── Accounts
        ├── Dashboard
        ├── All Vouchers
        └── Voucher Details
```

---

# 📝 Future Enhancements

Possible future improvements include:

* Pagination for large voucher lists
* Advanced dashboard charts
* Email notifications for approval/rejection
* Cloud-based signature storage
* PDF voucher generation
* Export vouchers to Excel/CSV
* Audit log for every workflow action
* Improved responsive UI
* Automated database migrations
* Unit and integration testing

---

# 👩‍💻 Development

This project was developed as a full-stack web application demonstrating:

* REST API development
* React frontend development
* Node.js and Express backend
* MySQL database integration
* JWT authentication
* Role-based authorization
* File upload handling
* CRUD operations
* Workflow/state management
* Form validation

---

## 👩‍💻 Developed By

**Sanika Muluk**

Computer Engineering Student

Full-Stack Java Developer

This project was independently designed and developed to demonstrate backend development, database integration, authentication, role-based access control, and workflow system implementation.

---

## 📄 License

This project is developed for academic and learning purposes.

---

⭐ If you found this project useful, please give it a star!

