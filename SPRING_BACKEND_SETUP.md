# 🚀 Spring Boot Backend Integration Guide

## 📋 Overview

Your React frontend has been configured to work with your Spring Boot backend. Here's how to set it up:

## 🔧 Backend Configuration

### 1. **API Endpoint Configuration**
The backend endpoint is configured in: `src/lib/api.ts`

```typescript
export const API_BASE_URL = 'http://localhost:8091/api' // Your Spring Boot backend URL
```

**To change your backend URL:**
- Edit line 4 in `src/lib/api.ts`
- Replace `http://localhost:8091/api` with your actual backend URL

### 2. **Authentication Endpoints**
Your Spring Boot backend should have these endpoints:

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request)
    
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Boolean>> validateToken(@RequestHeader("Authorization") String authHeader)
    
    @PostMapping("/create-admin")
    public ResponseEntity<Map<String, String>> createAdmin()
}
```

## 🎯 Frontend Changes Made

### ✅ **Files Created/Updated:**

1. **`src/lib/api.ts`** - API service for Spring Boot backend
2. **`src/services/spring-auth-service.ts`** - Authentication service
3. **`src/contexts/AuthContext.tsx`** - Updated to use Spring Boot auth
4. **`src/components/LoginForm.tsx`** - Updated to use username instead of email

### ✅ **Authentication Flow:**

1. **Login**: Username + Password → Spring Boot `/api/auth/login`
2. **Token Storage**: JWT token stored in localStorage
3. **Token Validation**: Automatic validation with `/api/auth/validate`
4. **Admin Check**: Role-based access control

## 🚀 Setup Instructions

### **Step 1: Start Your Spring Boot Backend**
```bash
# In your Spring Boot project directory
./mvnw spring-boot:run
# or
java -jar target/your-app.jar
```

### **Step 2: Update Backend URL (if needed)**
Edit `src/lib/api.ts`:
```typescript
export const API_BASE_URL = 'http://YOUR_BACKEND_URL:PORT/api'
```

### **Step 3: Create Admin User**
First time setup - call the create-admin endpoint:
```bash
curl -X POST http://localhost:8091/api/auth/create-admin
```

### **Step 4: Test Login**
Use these credentials in your frontend:
- **Email**: `admin@portfolio.com`
- **Password**: `admin123`

## 🔐 Authentication Details

### **Login Request Format:**
```json
{
  "email": "admin@portfolio.com",
  "password": "admin123"
}
```

### **Login Response Format:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@portfolio.com",
    "role": "ADMIN"
  }
}
```

### **Token Validation:**
- Frontend automatically includes `Authorization: Bearer <token>` header
- Backend validates token and returns `{"valid": true/false}`

## 🎨 Frontend Features

### ✅ **What Works Now:**
- ✅ Login with username/password
- ✅ JWT token authentication
- ✅ Admin role detection
- ✅ Automatic token validation
- ✅ Secure logout
- ✅ Protected admin routes

### ✅ **Admin Features:**
- ✅ LOGGING button (only visible to admins)
- ✅ Direct navigation to admin dashboard
- ✅ Role-based UI elements

## 🔧 Troubleshooting

### **Common Issues:**

1. **CORS Error**
   ```java
   @CrossOrigin(origins = "http://localhost:8081") // Your frontend URL
   ```

2. **Backend Not Running**
   - Check if Spring Boot is running on port 8091
   - Verify the API_BASE_URL in `src/lib/api.ts`

3. **Login Fails**
   - Check browser console for errors
   - Verify backend endpoints are accessible
   - Ensure admin user exists

4. **Token Validation Fails**
   - Check if JWT secret matches between frontend/backend
   - Verify token format in localStorage

## 📱 Testing

### **Test the Integration:**

1. **Start both servers:**
   ```bash
   # Backend (Spring Boot) - Port 8091
   ./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8091
   
   # Frontend (React) - Port 8081
   npm run dev
   ```

2. **Login Test:**
   - Go to your frontend
   - Click "Connexion" button
   - Use: `admin` / `admin123`
   - Should see "LOGGING" button appear

3. **Admin Dashboard:**
   - Click "LOGGING" button
   - Should navigate to admin dashboard

## 🎯 Next Steps

### **Optional Enhancements:**

1. **Add More API Endpoints:**
   ```typescript
   // In src/lib/api.ts
   export const API_ENDPOINTS = {
     auth: { ... },
     artworks: '/artworks',
     users: '/users',
     // Add your endpoints
   }
   ```

2. **Environment Variables:**
   ```bash
   # Create .env.local
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

3. **Error Handling:**
   - Add global error handling
   - Implement retry logic
   - Add loading states

## 🎉 Success!

Your React frontend is now fully integrated with your Spring Boot backend! 

**Key Benefits:**
- ✅ Secure JWT authentication
- ✅ Role-based access control
- ✅ Real-time token validation
- ✅ Clean separation of concerns
- ✅ Scalable architecture

**Ready to use with your Spring Boot AuthController!** 🚀
