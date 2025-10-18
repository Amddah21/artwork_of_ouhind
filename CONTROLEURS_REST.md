# 🌐 CONTRÔLEURS REST - ArtSpark Backend

## 🎯 **CONTRÔLEURS API REST**

Voici les contrôleurs REST pour exposer les API de votre application ArtSpark Studio Canvas.

---

## 🔐 **AUTH CONTROLLER**

**Chemin :** `src/main/java/com/artspark/controller/AuthController.java`

```java
package com.artspark.controller;

import com.artspark.config.JwtConfig;
import com.artspark.dto.AuthResponse;
import com.artspark.dto.LoginRequest;
import com.artspark.entity.User;
import com.artspark.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:3000"})
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtConfig jwtConfig;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("🔐 Tentative de connexion pour: " + loginRequest.getEmail());
            
            // Vérifier les credentials
            User user = userService.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));
            
            if (!userService.checkPassword(loginRequest.getPassword(), user.getPassword())) {
                System.out.println("❌ Échec de connexion: mot de passe incorrect");
                return ResponseEntity.status(401).body(Map.of("error", "Email ou mot de passe incorrect"));
            }

            // Générer le token JWT
            String token = jwtConfig.generateToken(user.getEmail(), user.getRole().name());
            System.out.println("✅ Token généré pour: " + user.getEmail());

            // Créer la réponse
            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setType("Bearer");
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setRole(user.getRole().name());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la connexion: " + e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Email ou mot de passe incorrect"));
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.ok(Map.of("valid", false));
            }

            String token = authHeader.substring(7);
            String email = jwtConfig.getUsernameFromToken(token);
            
            if (jwtConfig.validateToken(token, email)) {
                return ResponseEntity.ok(Map.of("valid", true));
            } else {
                return ResponseEntity.ok(Map.of("valid", false));
            }

        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("valid", false));
        }
    }

    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin() {
        try {
            System.out.println("🔧 Tentative de création d'admin...");
            
            User admin = userService.createDefaultAdmin();
            System.out.println("✅ Admin créé avec succès");

            Map<String, String> response = new HashMap<>();
            response.put("message", "Admin créé avec succès");
            response.put("username", admin.getUsername());
            response.put("email", admin.getEmail());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la création de l'admin: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Erreur lors de la création de l'admin"));
        }
    }
}
```

---

## 🎨 **ARTWORK CONTROLLER**

**Chemin :** `src/main/java/com/artspark/controller/ArtworkController.java`

```java
package com.artspark.controller;

import com.artspark.entity.Artwork;
import com.artspark.service.ArtworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/artworks")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:3000"})
public class ArtworkController {

    @Autowired
    private ArtworkService artworkService;

    // Routes publiques
    @GetMapping
    public ResponseEntity<List<Artwork>> getAllArtworks() {
        List<Artwork> artworks = artworkService.findAll();
        return ResponseEntity.ok(artworks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Artwork> getArtworkById(@PathVariable Long id) {
        return artworkService.findById(id)
                .map(artwork -> ResponseEntity.ok(artwork))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Artwork>> searchArtworks(@RequestParam(required = false) String q,
                                                       @RequestParam(required = false) String technique,
                                                       @RequestParam(required = false) Integer annee) {
        List<Artwork> artworks;
        
        if (q != null && !q.isEmpty()) {
            artworks = artworkService.searchArtworks(q);
        } else {
            artworks = artworkService.advancedSearch(null, technique, annee);
        }
        
        return ResponseEntity.ok(artworks);
    }

    @GetMapping("/images/{fileName}")
    public ResponseEntity<byte[]> getImage(@PathVariable String fileName) {
        try {
            // Logique pour servir les images
            // Pour l'instant, retourner une réponse vide
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Routes protégées (ADMIN)
    @PostMapping
    public ResponseEntity<Artwork> createArtwork(@RequestBody Artwork artwork) {
        try {
            Artwork createdArtwork = artworkService.createArtwork(artwork);
            return ResponseEntity.ok(createdArtwork);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Artwork> updateArtwork(@PathVariable Long id, @RequestBody Artwork artworkDetails) {
        try {
            Artwork updatedArtwork = artworkService.updateArtwork(id, artworkDetails);
            return ResponseEntity.ok(updatedArtwork);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteArtwork(@PathVariable Long id) {
        try {
            artworkService.deleteArtwork(id);
            return ResponseEntity.ok(Map.of("message", "Œuvre supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = artworkService.uploadImage(file);
            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Erreur lors de l'upload"));
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Artwork>> getRecentArtworks() {
        List<Artwork> recentArtworks = artworkService.findRecentArtworks();
        return ResponseEntity.ok(recentArtworks);
    }

    @GetMapping("/technique/{technique}")
    public ResponseEntity<List<Artwork>> getArtworksByTechnique(@PathVariable String technique) {
        List<Artwork> artworks = artworkService.findByTechnique(technique);
        return ResponseEntity.ok(artworks);
    }

    @GetMapping("/year/{annee}")
    public ResponseEntity<List<Artwork>> getArtworksByYear(@PathVariable Integer annee) {
        List<Artwork> artworks = artworkService.findByAnnee(annee);
        return ResponseEntity.ok(artworks);
    }
}
```

---

## 💬 **REVIEW CONTROLLER**

**Chemin :** `src/main/java/com/artspark/controller/ReviewController.java`

```java
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
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:3000"})
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
```

---

## 📧 **CONTACT CONTROLLER**

**Chemin :** `src/main/java/com/artspark/controller/ContactController.java`

```java
package com.artspark.controller;

import com.artspark.entity.ContactMessage;
import com.artspark.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:3000"})
public class ContactController {

    @Autowired
    private ContactService contactService;

    // Routes publiques
    @PostMapping
    public ResponseEntity<Map<String, String>> sendMessage(@RequestBody ContactMessage message) {
        try {
            ContactMessage savedMessage = contactService.createMessage(message);
            return ResponseEntity.ok(Map.of("message", "Message envoyé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Erreur lors de l'envoi du message"));
        }
    }

    // Routes protégées (ADMIN)
    @GetMapping
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        List<ContactMessage> messages = contactService.findAll();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<ContactMessage>> getUnreadMessages() {
        List<ContactMessage> unreadMessages = contactService.findUnreadMessages();
        return ResponseEntity.ok(unreadMessages);
    }

    @PostMapping("/{contactId}/read")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable Long contactId) {
        try {
            contactService.markAsRead(contactId);
            return ResponseEntity.ok(Map.of("message", "Message marqué comme lu"));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{contactId}/responded")
    public ResponseEntity<Map<String, String>> markAsResponded(@PathVariable Long contactId) {
        try {
            contactService.markAsResponded(contactId);
            return ResponseEntity.ok(Map.of("message", "Message marqué comme répondu"));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{contactId}")
    public ResponseEntity<Map<String, String>> deleteMessage(@PathVariable Long contactId) {
        try {
            contactService.deleteMessage(contactId);
            return ResponseEntity.ok(Map.of("message", "Message supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<ContactMessage>> searchMessages(@RequestParam String q) {
        List<ContactMessage> messages = contactService.searchMessages(q);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getContactStats() {
        Map<String, Object> stats = Map.of(
            "totalMessages", contactService.findAll().size(),
            "unreadMessages", contactService.countUnreadMessages(),
            "unrespondedMessages", contactService.countUnrespondedMessages()
        );
        return ResponseEntity.ok(stats);
    }
}
```

---

## 📊 **STATS CONTROLLER**

**Chemin :** `src/main/java/com/artspark/controller/StatsController.java`

```java
package com.artspark.controller;

import com.artspark.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:3000"})
public class StatsController {

    @Autowired
    private StatsService statsService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllStats() {
        Map<String, Object> stats = statsService.getAllStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/artworks")
    public ResponseEntity<Map<String, Object>> getArtworkStats() {
        Map<String, Object> stats = statsService.getArtworkStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/reviews")
    public ResponseEntity<Map<String, Object>> getReviewStats() {
        Map<String, Object> stats = statsService.getReviewStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/contact")
    public ResponseEntity<Map<String, Object>> getContactStats() {
        Map<String, Object> stats = statsService.getContactStats();
        return ResponseEntity.ok(stats);
    }
}
```

---

## 🔧 **GLOBAL EXCEPTION HANDLER**

**Chemin :** `src/main/java/com/artspark/exception/GlobalExceptionHandler.java`

```java
package com.artspark.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(
            RuntimeException ex, WebRequest request) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGlobalException(
            Exception ex, WebRequest request) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Une erreur interne s'est produite");
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

**Ces contrôleurs REST sont maintenant prêts pour votre backend Spring Boot !** 🚀

Voulez-vous que je continue avec la configuration de sécurité et JWT ?
