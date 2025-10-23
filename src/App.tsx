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
import Index from "./pages/Index";
import ArtworkDetail from "./pages/ArtworkDetail";
import GalleryDetail from "./pages/GalleryDetail";
import Voting from "./pages/Voting";
import Comments from "./pages/Comments";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import "@/styles/theme.css";
import "@/styles/nature-gallery.css";
import "@/styles/luxury-gallery.css";

const queryClient = new QueryClient();

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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/artwork/:id" element={<ArtworkDetail />} />
            <Route path="/gallery/:galleryId" element={<GalleryDetail />} />
            <Route path="/voting" element={<Voting />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
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
