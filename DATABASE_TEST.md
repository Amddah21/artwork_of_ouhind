# Test Supabase Connection

## Instructions to Test Database Connection

1. Open your browser's Developer Console (F12)
2. Navigate to the Admin Dashboard at: https://omhind-art.com/admin
3. Try to add an artwork
4. Check the console for any error messages

## Quick Test Commands

You can run these in the browser console:

```javascript
// Test Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

// Test artwork fetch
import { supabase } from '@/lib/api';
const { data, error } = await supabase.from('artworks').select('*').limit(1);
console.log('Test fetch result:', { data, error });
```

## Common Issues

1. **401 Unauthorized**: Check if RLS (Row Level Security) policies are set correctly
2. **403 Forbidden**: Verify the ANON key has the correct permissions
3. **404 Not Found**: Check if the 'artworks' table exists in Supabase
4. **Network Error**: Check if CORS is configured correctly

## Next Steps

1. Check Supabase dashboard for RLS policies
2. Verify table structure matches the Artwork interface
3. Test with a simple insert query
4. Check browser console for detailed error messages
