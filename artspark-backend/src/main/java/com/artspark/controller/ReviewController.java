package com.artspark.controller;

import com.artspark.entity.Review;
import com.artspark.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:8081", "http://localhost:3000"})
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Routes publiques
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.findAllApproved();
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/artwork/{artworkId}")
    public ResponseEntity<List<Review>> getReviewsByArtwork(@PathVariable Long artworkId) {
        List<Review> reviews = reviewService.findByArtworkId(artworkId);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        try {
            Review createdReview = reviewService.createReview(review);
            return ResponseEntity.ok(createdReview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{reviewId}/helpful")
    public ResponseEntity<Map<String, Object>> markAsHelpful(@PathVariable Long reviewId) {
        try {
            Review review = reviewService.markAsHelpful(reviewId);
            return ResponseEntity.ok(Map.of(
                "message", "Avis marqué comme utile",
                "helpful", review.getHelpful()
            ));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Routes protégées (ADMIN)
    @GetMapping("/pending")
    public ResponseEntity<List<Review>> getPendingReviews() {
        List<Review> pendingReviews = reviewService.findAllPending();
        return ResponseEntity.ok(pendingReviews);
    }

    @PostMapping("/{reviewId}/approve")
    public ResponseEntity<Map<String, String>> approveReview(@PathVariable Long reviewId) {
        try {
            reviewService.approveReview(reviewId);
            return ResponseEntity.ok(Map.of("message", "Avis approuvé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{reviewId}/reject")
    public ResponseEntity<Map<String, String>> rejectReview(@PathVariable Long reviewId) {
        try {
            reviewService.rejectReview(reviewId);
            return ResponseEntity.ok(Map.of("message", "Avis rejeté"));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Map<String, String>> deleteReview(@PathVariable Long reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return ResponseEntity.ok(Map.of("message", "Avis supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/helpful")
    public ResponseEntity<List<Review>> getMostHelpfulReviews() {
        List<Review> helpfulReviews = reviewService.findMostHelpfulReviews();
        return ResponseEntity.ok(helpfulReviews);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Review>> searchReviews(@RequestParam String q) {
        List<Review> reviews = reviewService.searchReviews(q);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getReviewStats() {
        Map<String, Object> stats = Map.of(
            "totalReviews", reviewService.countByStatus(Review.ReviewStatus.APPROVED) +
                           reviewService.countByStatus(Review.ReviewStatus.PENDING) +
                           reviewService.countByStatus(Review.ReviewStatus.REJECTED),
            "approvedReviews", reviewService.countByStatus(Review.ReviewStatus.APPROVED),
            "pendingReviews", reviewService.countByStatus(Review.ReviewStatus.PENDING),
            "rejectedReviews", reviewService.countByStatus(Review.ReviewStatus.REJECTED)
        );
        return ResponseEntity.ok(stats);
    }
}
