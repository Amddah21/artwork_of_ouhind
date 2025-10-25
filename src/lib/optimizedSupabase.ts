import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://spionvuemjgnvjlesapp.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaW9udnVlbWpnbnZqbGVzYXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDE1NTEsImV4cCI6MjA3NjkxNzU1MX0.qdgPAXb3fQPGd9xj_pKJhMtyq1ulDa01wdXFnXtliW4';

// Enhanced Supabase client with connection pooling and retry logic
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'artwork-gallery-v1'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Connection health check
export const checkConnectionHealth = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select('id')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error('Connection health check failed:', error);
    return false;
  }
};

// Retry wrapper for API calls
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      console.log(`Attempt ${attempt} failed, retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
};

// Optimized query builder with caching hints
export const createOptimizedQuery = (table: string) => {
  return {
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => withRetry(() => 
          supabase.from(table).select(columns).eq(column, value).single()
        ),
        order: (orderBy: string, options?: { ascending?: boolean }) => 
          withRetry(() => 
            supabase.from(table).select(columns).eq(column, value).order(orderBy, options)
          ),
        limit: (count: number) => 
          withRetry(() => 
            supabase.from(table).select(columns).eq(column, value).limit(count)
          )
      }),
      order: (orderBy: string, options?: { ascending?: boolean }) => 
        withRetry(() => 
          supabase.from(table).select(columns).order(orderBy, options)
        ),
      limit: (count: number) => 
        withRetry(() => 
          supabase.from(table).select(columns).limit(count)
        )
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => withRetry(() => 
          supabase.from(table).insert(data).select().single()
        )
      })
    }),
    update: (updates: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: () => withRetry(() => 
            supabase.from(table).update(updates).eq(column, value).select().single()
          )
        })
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => 
        withRetry(() => 
          supabase.from(table).delete().eq(column, value)
        ),
      neq: (column: string, value: any) => 
        withRetry(() => 
          supabase.from(table).delete().neq(column, value)
        )
    }),
    upsert: (data: any) => ({
      select: () => ({
        single: () => withRetry(() => 
          supabase.from(table).upsert(data).select().single()
        )
      })
    })
  };
};

// Connection monitoring
let connectionStatus: 'connected' | 'disconnected' | 'checking' = 'checking';

export const getConnectionStatus = () => connectionStatus;

export const monitorConnection = () => {
  const checkInterval = setInterval(async () => {
    connectionStatus = 'checking';
    const isHealthy = await checkConnectionHealth();
    connectionStatus = isHealthy ? 'connected' : 'disconnected';
    
    if (!isHealthy) {
      console.warn('⚠️ Database connection lost, attempting to reconnect...');
    }
  }, 30000); // Check every 30 seconds
  
  return () => clearInterval(checkInterval);
};
