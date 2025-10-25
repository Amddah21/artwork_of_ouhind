# 🔧 SUPABASE CORS FIX - Complete Solution

## 🚨 Problem Identified

The console shows CORS errors blocking requests from your local IP `192.168.40.206:8080` to Supabase.

Error: `Access to fetch at 'https://aogxcbkfggfnvofavohp.supabase.co/rest/v1/artworks...' from origin 'http://192.168.40.206:8080' has been blocked by CORS policy`

## ✅ Solution Steps

### Step 1: Add Your Local IP to Supabase Allowed Origins

1. Go to your Supabase project dashboard:
   https://supabase.com/dashboard/project/aogxcbkfggfnvofavohp

2. Navigate to **Settings** → **API** → **Allowed Origins**

3. Add these origins:
   ```
   http://192.168.40.206:8080
   http://localhost:8080
   http://localhost:5173
   http://127.0.0.1:8080
   ```

4. Click **Save**

### Step 2: Configure Supabase Authentication Settings

1. Go to **Authentication** → **URL Configuration**

2. Add to **Site URL**:
   ```
   http://192.168.40.206:8080
   ```

3. Add to **Redirect URLs**:
   ```
   http://192.168.40.206:8080/**
   http://localhost:8080/**
   http://localhost:5173/**
   ```

4. Click **Save**

### Step 3: Restart Your Development Server

After updating Supabase settings, restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Verify the Fix

1. Open your browser console
2. Check that there are no more CORS errors
3. Test loading artworks

## 🔍 Alternative: Allow All Origins (Development Only)

⚠️ **WARNING: Only for development!**

If you need to allow all origins temporarily:

1. In Supabase dashboard, go to **Settings** → **API**

2. Find **Allowed Origins** and add:
   ```
   *
   ```

3. This will allow requests from any origin (NOT recommended for production)

## 🎯 Expected Result

After fixing CORS:
- ✅ No more CORS errors in console
- ✅ Artworks load successfully
- ✅ Database operations work normally
- ✅ No "Failed to fetch" errors

## 🚨 Common Issues

### Issue 1: Still getting CORS errors
**Solution**: Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue 2: Supabase settings not saving
**Solution**: Wait a few minutes for changes to propagate

### Issue 3: Works on localhost but not on IP
**Solution**: Make sure to add both `localhost` and your IP to allowed origins

### Issue 4: Database timeout errors
**Solution**: This is separate from CORS - check your Supabase project health

## 📝 Verification Checklist

- [ ] `.env` file created with Supabase credentials
- [ ] Supabase allowed origins updated
- [ ] Supabase URL configuration updated
- [ ] Development server restarted
- [ ] Browser cache cleared
- [ ] No CORS errors in console
- [ ] Artworks loading successfully

## 🔄 If Still Not Working

1. **Check your network**: Make sure you're on the same network
2. **Verify Supabase project**: Ensure project is active and not paused
3. **Check environment variables**: Verify `.env` file is in the root directory
4. **Try different port**: Use `localhost:5173` instead of the IP

## 📞 Quick Test

Run this in browser console to test the connection:

```javascript
fetch('https://aogxcbkfggfnvofavohp.supabase.co/rest/v1/artworks?select=*', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZ3hjYmtmZ2dmbnZvZmF2b2hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MTMxNDUsImV4cCI6MjA3NjI4OTE0NX0.nDKVGgjXIYJfAAkniUPkx4ckdDJJz21ogiC4A2IYVEc'
  }
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

If this works, CORS is fixed! If not, the issue is in Supabase settings.

