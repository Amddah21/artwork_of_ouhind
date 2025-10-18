# 🔧 Admin Login Troubleshooting Guide

## ✅ **What I've Fixed:**

1. **Added Protected Route** - Admin dashboard now requires authentication
2. **Created ProtectedRoute component** - Checks for admin access
3. **Updated App.tsx** - Admin route is now protected

## 🔍 **Debug Steps:**

### **Step 1: Check Environment Variables**

Make sure your `.env.local` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://aogxcbkfggfnvofavohp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZ3hjYmtmZ2dmbnZvZmF2b2hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MTMxNDUsImV4cCI6MjA3NjI4OTE0NX0.nDKVGgjXIYJfAAkniUPkx4ckdDJJz21ogiC4A2IYVEc
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZ3hjYmtmZ2dmbnZvZmF2b2hwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDcxMzE0NSwiZXhwIjoyMDc2Mjg5MTQ1fQ.Hvnb89C70wI3plHMKCUaaUw_MtV62p58WihXBwvw82s
```

### **Step 2: Set Up Admin User in Supabase**

1. **Go to your Supabase dashboard**: https://supabase.com/dashboard/project/aogxcbkfggfnvofavohp
2. **Navigate to Authentication > Users**
3. **Click "Add user"**
4. **Enter**:
   - Email: `omhind53@gmail.com`
   - Password: `admin123`
5. **Click "Create user"**

### **Step 3: Update User Role to Admin**

Run this SQL in your Supabase SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'omhind53@gmail.com';
```

### **Step 4: Test the Login**

1. **Restart your dev server**:

   ```bash
   npm run dev
   ```

2. **Click "Connexion" button** in the navbar
3. **Enter credentials**:

   - Email: `omhind53@gmail.com`
   - Password: `admin123`

4. **After successful login**, you should see:
   - "Déconnexion" button instead of "Connexion"
   - "LOGGING" button (admin dashboard access)

### **Step 5: Access Admin Dashboard**

1. **Click "LOGGING" button** in navbar
2. **Or go directly to**: `http://localhost:5173/admin`

## 🚨 **Common Issues & Solutions:**

### **Issue 1: "Supabase not configured" warning**

- **Solution**: Check your `.env.local` file has correct values
- **Restart** the dev server after updating

### **Issue 2: Login fails with "Invalid credentials"**

- **Solution**: Make sure the user exists in Supabase Auth
- **Check**: User is created in Authentication > Users

### **Issue 3: Login succeeds but no admin access**

- **Solution**: Run the SQL query to update user role to 'admin'
- **Check**: User profile has `role = 'admin'`

### **Issue 4: Can't access /admin route**

- **Solution**: Make sure you're logged in as admin
- **Check**: Browser console for any errors

## 🔧 **Manual Test:**

1. **Open browser console** (F12)
2. **Look for any error messages**
3. **Check if Supabase connection is working**
4. **Verify user authentication state**

## 📞 **Quick Test Commands:**

If you want to test the database connection, run this in Supabase SQL Editor:

```sql
-- Check if admin user exists
SELECT * FROM public.profiles WHERE email = 'omhind53@gmail.com';

-- Check all users
SELECT * FROM public.profiles;
```

---

**Try these steps and let me know what happens!** The login should work once the admin user is properly set up in Supabase. 🎨✨
