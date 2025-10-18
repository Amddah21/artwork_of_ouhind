package com.artspark.service;

import com.artspark.entity.Artwork;
import com.artspark.entity.Review;
import com.artspark.repository.ArtworkRepository;
import com.artspark.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private ArtworkRepository artworkRepository;
    
    // Créer un nouvel avis
    public Review createReview(Review review) {
        // Vérifier que l'œuvre existe
        Artwork artwork = artworkRepository.findById(review.getArtwork().getId())
                .orElseThrow(() -> new RuntimeException("Œuvre non trouvée"));
        
        review.setArtwork(artwork);
        review.setStatus(Review.ReviewStatus.PENDING);
        
        return reviewRepository.save(review);
    }
    
    // Trouver tous les avis
    public List<Review> findAll() {
        return reviewRepository.findAll();
    }
    
    // Trouver un avis par ID
    public Optional<Review> findById(Long id) {
        return reviewRepository.findById(id);
    }
    
    // Trouver tous les avis approuvés
    public List<Review> findAllApproved() {
        return reviewRepository.findAllApprovedReviews();
    }
    
    // Trouver tous les avis en attente
    public List<Review> findAllPending() {
        return reviewRepository.findAllPendingReviews();
    }
    
    // Trouver les avis d'une œuvre
    public List<Review> findByArtworkId(Long artworkId) {
        return reviewRepository.findByArtworkIdAndStatus(artworkId, Review.ReviewStatus.APPROVED);
    }
    
    // Approuver un avis
    public Review approveReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));
        
        review.setStatus(Review.ReviewStatus.APPROVED);
        return reviewRepository.save(review);
    }
    
    // Rejeter un avis
    public Review rejectReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));
        
        review.setStatus(Review.ReviewStatus.REJECTED);
        return reviewRepository.save(review);
    }
    
    // Supprimer un avis
    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("Avis non trouvé");
        }
        reviewRepository.deleteById(id);
    }
    
    // Marquer un avis comme utile
    public Review markAsHelpful(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));
        
        review.setHelpful(review.getHelpful() + 1);
        return reviewRepository.save(review);
    }
    
    // Calculer la note moyenne d'une œuvre
    public Double getAverageRating(Long artworkId) {
        Double average = reviewRepository.getAverageRatingByArtworkId(artworkId);
        return average != null ? average : 0.0;
    }
    
    // Compter les avis d'une œuvre
    public Long countReviews(Long artworkId) {
        return reviewRepository.countByArtworkId(artworkId);
    }
    
    // Trouver les avis les plus utiles
    public List<Review> findMostHelpfulReviews() {
        return reviewRepository.findMostHelpfulReviews();
    }
    
    // Rechercher des avis
    public List<Review> searchReviews(String search) {
        return reviewRepository.findBySearchTerm(search);
    }
    
    // Obtenir les statistiques des avis
    public long countByStatus(Review.ReviewStatus status) {
        return reviewRepository.countByStatus(status);
    }
    
    // Trouver les avis récents
    public List<Review> findRecentReviews() {
        return reviewRepository.findRecentReviews();
    }
}
