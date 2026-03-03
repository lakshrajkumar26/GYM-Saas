# B Gym API Routes

Base URL: `http://localhost:5000/api`

---

## 🔐 Authentication Routes

### Register Member
```
POST /auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91-9876543210",
  "address": "123 Main Street"
}
Response: { "message": "Member registered successfully" }
```

### Login
```
POST /auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
Response: {
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "role": "MEMBER",
    "member": { ... }
  }
}
```

---

## 👥 Members Routes
**Auth Required** | **Roles**: ADMIN, TRAINER, STAFF

### Get All Members
```
GET /members
Headers: { "Authorization": "Bearer <token>" }
Response: [{ member objects }]
```

### Get Member by ID
```
GET /members/:id
Headers: { "Authorization": "Bearer <token>" }
Response: { member object with plan, attendances, payments }
```

### Create Member
```
POST /members
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "userId": "user_uuid",
  "planId": "plan_uuid",
  "startDate": "2024-01-01",
  "expiryDate": "2024-02-01",
  "height": 175,
  "weight": 70,
  "bodyFat": 15
}
Response: { member object }
```

### Update Member
```
PUT /members/:id
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "planId": "plan_uuid",
  "height": 175,
  "weight": 68
}
Response: { updated member object }
```

### Delete Member
```
DELETE /members/:id
Headers: { "Authorization": "Bearer <token>" }
Response: { "message": "Member deleted" }
```

---

checked up till here in postman

## 📦 Plans Routes
**Auth Required** | **Roles**: ADMIN, TRAINER, STAFF

### Get All Plans
```
GET /plans
Headers: { "Authorization": "Bearer <token>" }
Response: [{ plan objects }]
```

### Create Plan
```
POST /plans
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "name": "Premium",
  "price": 4999,
  "duration": 30
}
Response: { plan object }
```

---

## 📅 Attendance Routes
**Auth Required** | **Roles**: ADMIN, TRAINER, STAFF

### Check-in Member
```
POST /attendance/checkin
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "memberId": "member_uuid"
}
Response: { attendance object }
```

### Get Member Attendance
```
GET /attendance/member/:memberId
Headers: { "Authorization": "Bearer <token>" }
Response: [{ attendance records }]
```

---

## 💳 Payment Routes
**Auth Required** | **Roles**: ADMIN, TRAINER, STAFF

### Create Payment
```
POST /payments
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "memberId": "member_uuid",
  "amount": 4999,
  "mode": "CASH",
  "status": "PAID",
  "reference": "REF123"
}
Response: { payment object }
```

### Get All Payments
```
GET /payments
Headers: { "Authorization": "Bearer <token>" }
Response: [{ payment objects with member details }]
```

### Get Payments by Member
```
GET /payments/member/:memberId
Headers: { "Authorization": "Bearer <token>" }
Response: [{ payment records }]
```

### Update Payment Status
```
PUT /payments/:id
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "status": "PAID"
}
Response: { updated payment object }
```

---

## 📊 Dashboard Routes
**Auth Required** | **Roles**: ADMIN, TRAINER, STAFF

### Get Dashboard Stats
```
GET /dashboard/stats
Headers: { "Authorization": "Bearer <token>" }
Response: {
  "totalMembers": 100,
  "activeMembers": 85,
  "revenue": 450000,
  "todayCheckIns": 45
}
```

---

## 👤 User Routes
**Auth Required**

### Get User Profile
```
GET /users/profile
Headers: { "Authorization": "Bearer <token>" }
Response: { user object with member details }
```

### Update User Profile
```
PUT /users/profile
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "name": "John Doe Updated",
  "phone": "+91-9876543210"
}
Response: { updated user object }
```

---

## 🔔 Notification Routes
**Auth Required**

### Get User Notifications
```
GET /notifications
Headers: { "Authorization": "Bearer <token>" }
Response: [{ notification objects }]
```

### Mark Notification as Read
```
PUT /notifications/:id/read
Headers: { "Authorization": "Bearer <token>" }
Response: { "message": "Notification marked as read" }
```

---

## 🏥 Health Check

### Server Health
```
GET /health
Response: {
  "status": "OK",
  "message": "Server is running",
  "cors": "enabled",
  "timestamp": "2024-03-03T10:00:00.000Z"
}
```

---

## 📝 Notes

### Roles
- **ADMIN**: Full access to all routes
- **TRAINER**: Access to members, attendance, plans
- **STAFF**: Access to members, attendance, payments
- **MEMBER**: Access to own profile and data only

### Payment Modes
- `CASH`
- `UPI`
- `CARD`
- `ONLINE`

### Payment Status
- `PENDING`
- `PAID`
- `FAILED`

### Member Status
- `ACTIVE`
- `EXPIRED`

---

## 🚀 Quick Start

1. **Start Server**: `cd server && npm start`
2. **Start Client**: `cd client && npm run dev`
3. **Register**: POST to `/api/auth/register`
4. **Login**: POST to `/api/auth/login`
5. **Use Token**: Add `Authorization: Bearer <token>` to headers

---

## 🔧 Environment Variables

### Server (.env)
```
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
PORT=5000
GYM_NAME=B Gym Internationals
```

### Client (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
