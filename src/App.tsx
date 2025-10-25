import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArtworkProvider } from "@/contexts/ArtworkContext";
import { ReviewProvider } from "@/contexts/ReviewContext";
import { RatingProvider } from "@/contexts/RatingContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { GalleryProvider } from "@/contexts/GalleryContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useCopyrightProtection } from "@/hooks/useCopyrightProtection";
import ArtisticNavbar from "@/components/ArtisticNavbar";
import ArtisticFooter from "@/components/ArtisticFooter";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Suspense, lazy } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AdminMiddleware from "@/components/AdminMiddleware";
import "@/styles/theme.css";
import "@/styles/nature-gallery.css";
import "@/styles/luxury-gallery.css";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const ArtworkDetail = lazy(() => import("./pages/ArtworkDetail"));
const GalleryDetail = lazy(() => import("./pages/GalleryDetail"));
const Voting = lazy(() => import("./pages/Voting"));
const Comments = lazy(() => import("./pages/Comments"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on resource exhaustion errors
        if (error?.message?.includes('ERR_INSUFFICIENT_RESOURCES')) {
          console.warn('🚫 [QueryClient] Skipping retry due to resource exhaustion');
          return false;
        }
        // Only retry up to 2 times for other errors
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Prevent unnecessary refetches
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry mutations on resource exhaustion
        if (error?.message?.includes('ERR_INSUFFICIENT_RESOURCES')) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});

// Inner component that uses the copyright protection hook
const AppContent = () => {
  // Initialize global copyright protection
  useCopyrightProtection({
    enableRightClickProtection: true,
    enableDragProtection: true,
    enableKeyboardProtection: true,
    enablePrintProtection: true,
    enableScreenshotProtection: true,
    showProtectionMessages: true,
    protectionMessage: '🛡️ Image protégée par copyright - © Omhind'
  });

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <ArtisticNavbar />
        <main className="flex-1">
          <Suspense fallback={<LoadingSpinner size="lg" text="Chargement de la page..." />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/artwork/:id" element={<ArtworkDetail />} />
              <Route path="/gallery/:galleryId" element={<GalleryDetail />} />
              <Route path="/voting" element={<Voting />} />
              <Route path="/comments" element={<Comments />} />
              <Route path="/admin" element={
                <AdminMiddleware>
                  <AdminDashboard />
                </AdminMiddleware>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <ArtisticFooter />
      </div>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <ArtworkProvider>
            <GalleryProvider>
              <ReviewProvider>
                <RatingProvider>
                  <Toaster />
                  <Sonner />
                  <AppContent />
                </RatingProvider>
              </ReviewProvider>
            </GalleryProvider>
          </ArtworkProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
