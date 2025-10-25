# Supabase Environment Configuration

## Instructions
Create a `.env` file in your project root with the following content:

```
# Supabase Configuration
VITE_SUPABASE_URL=https://spionvuemjgnvjlesapp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaW9udnVlbWpnbnZqbGVzYXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDE1NTEsImV4cCI6MjA3NjkxNzU1MX0.qdgPAXb3fQPGd9xj_pKJhMtyq1ulDa01wdXFnXtliW4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaW9udnVlbWpnbnZqbGVzYXBwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM0MTU1MSwiZXhwIjoyMDc2OTE3NTUxfQ.9-Y-TaElEnFx1x_qqwfmJSLpgO7sw1Wj10T-pYuW2_Y
```

## What I've Updated

I've updated the following files with your new Supabase credentials as fallback values:

1. **src/lib/supabase.ts** - Main Supabase client configuration
2. **src/lib/api.ts** - API configuration with fallback values
3. **src/contexts/AuthContext.tsx** - Authentication context with fallback values

## Service Role Key

The service role key is included in the environment configuration but is not currently used in the codebase. If you need to use it for admin operations that bypass RLS (Row Level Security), you would need to create a separate Supabase client with the service role key.

## Next Steps

1. Create the `.env` file manually with the content above
2. Restart your development server to load the new environment variables
3. Test the connection to ensure everything is working properly

The application will now use your new Supabase project credentials!
