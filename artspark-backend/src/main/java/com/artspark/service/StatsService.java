package com.artspark.service;

import com.artspark.entity.Review;
import com.artspark.entity.User;
import com.artspark.repository.ArtworkRepository;
import com.artspark.repository.ContactMessageRepository;
import com.artspark.repository.ReviewRepository;
import com.artspark.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StatsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ArtworkRepository artworkRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private ContactMessageRepository contactMessageRepository;
    
    // Obtenir toutes les statistiques
    public Map<String, Object> getAllStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Statistiques des utilisateurs
        stats.put("totalUsers", userRepository.count());
        stats.put("totalAdmins", userRepository.countByRole(User.Role.ADMIN));
        stats.put("totalRegularUsers", userRepository.countByRole(User.Role.USER));
        
        // Statistiques des œuvres
        stats.put("totalArtworks", artworkRepository.count());
        
        // Statistiques des avis
        stats.put("totalReviews", reviewRepository.count());
        stats.put("approvedReviews", reviewRepository.countByStatus(Review.ReviewStatus.APPROVED));
        stats.put("pendingReviews", reviewRepository.countByStatus(Review.ReviewStatus.PENDING));
        stats.put("rejectedReviews", reviewRepository.countByStatus(Review.ReviewStatus.REJECTED));
        
        // Statistiques des messages de contact
        stats.put("totalContactMessages", contactMessageRepository.count());
        stats.put("unreadMessages", contactMessageRepository.countByIsReadFalse());
        stats.put("unrespondedMessages", contactMessageRepository.countByIsRespondedFalse());
        
        // Calculer la note moyenne globale
        Double averageRating = reviewRepository.findAllApprovedReviews().stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        stats.put("averageRating", averageRating);
        
        return stats;
    }
    
    // Obtenir les statistiques des œuvres
    public Map<String, Object> getArtworkStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalArtworks", artworkRepository.count());
        stats.put("techniques", artworkRepository.countByTechnique());
        stats.put("yearlyStats", artworkRepository.countByAnnee());
        
        return stats;
    }
    
    // Obtenir les statistiques des avis
    public Map<String, Object> getReviewStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalReviews", reviewRepository.count());
        stats.put("approvedReviews", reviewRepository.countByStatus(Review.ReviewStatus.APPROVED));
        stats.put("pendingReviews", reviewRepository.countByStatus(Review.ReviewStatus.PENDING));
        stats.put("rejectedReviews", reviewRepository.countByStatus(Review.ReviewStatus.REJECTED));
        
        return stats;
    }
    
    // Obtenir les statistiques des messages
    public Map<String, Object> getContactStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalMessages", contactMessageRepository.count());
        stats.put("unreadMessages", contactMessageRepository.countByIsReadFalse());
        stats.put("unrespondedMessages", contactMessageRepository.countByIsRespondedFalse());
        stats.put("readStatusStats", contactMessageRepository.countByReadStatus());
        
        return stats;
    }
}
