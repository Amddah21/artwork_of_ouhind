package com.artspark.repository;

import com.artspark.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // Trouver tous les avis par œuvre
    List<Review> findByArtworkId(Long artworkId);
    
    // Trouver tous les avis approuvés par œuvre
    List<Review> findByArtworkIdAndStatus(Long artworkId, Review.ReviewStatus status);
    
    // Trouver tous les avis en attente
    List<Review> findByStatus(Review.ReviewStatus status);
    
    // Trouver tous les avis approuvés
    @Query("SELECT r FROM Review r WHERE r.status = 'APPROVED' ORDER BY r.createdAt DESC")
    List<Review> findAllApprovedReviews();
    
    // Trouver tous les avis en attente
    @Query("SELECT r FROM Review r WHERE r.status = 'PENDING' ORDER BY r.createdAt ASC")
    List<Review> findAllPendingReviews();
    
    // Calculer la note moyenne d'une œuvre
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.artwork.id = :artworkId AND r.status = 'APPROVED'")
    Double getAverageRatingByArtworkId(@Param("artworkId") Long artworkId);
    
    // Compter le nombre d'avis par œuvre
    @Query("SELECT COUNT(r) FROM Review r WHERE r.artwork.id = :artworkId AND r.status = 'APPROVED'")
    Long countByArtworkId(@Param("artworkId") Long artworkId);
    
    // Trouver les avis les plus utiles
    @Query("SELECT r FROM Review r WHERE r.status = 'APPROVED' ORDER BY r.helpful DESC, r.createdAt DESC")
    List<Review> findMostHelpfulReviews();
    
    // Trouver les avis par note
    List<Review> findByRatingAndStatus(Integer rating, Review.ReviewStatus status);
    
    // Rechercher des avis par contenu
    @Query("SELECT r FROM Review r WHERE " +
           "LOWER(r.comment) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(r.authorName) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Review> findBySearchTerm(@Param("search") String search);
    
    // Compter les avis par statut
    long countByStatus(Review.ReviewStatus status);
    
    // Trouver les avis récents
    @Query("SELECT r FROM Review r ORDER BY r.createdAt DESC")
    List<Review> findRecentReviews();
}
