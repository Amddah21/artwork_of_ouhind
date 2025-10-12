import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArtworkProvider } from "@/contexts/ArtworkContext";
import { ReviewProvider } from "@/contexts/ReviewContext";
import { RatingProvider } from "@/contexts/RatingContext";
import ArtisticNavbar from "@/components/ArtisticNavbar";
import ArtisticFooter from "@/components/ArtisticFooter";
import Index from "./pages/Index";
import ArtworkDetail from "./pages/ArtworkDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Favorites from "./pages/Favorites";
import Voting from "./pages/Voting";
import Comments from "./pages/Comments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ArtworkProvider>
        <ReviewProvider>
          <RatingProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <ArtisticNavbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/artwork/:id" element={<ArtworkDetail />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/voting" element={<Voting />} />
                    <Route path="/comments" element={<Comments />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <ArtisticFooter />
              </div>
            </BrowserRouter>
          </RatingProvider>
        </ReviewProvider>
      </ArtworkProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
