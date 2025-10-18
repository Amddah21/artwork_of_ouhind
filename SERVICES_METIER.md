# 🔧 SERVICES MÉTIER - ArtSpark Backend

## 🏗️ **SERVICES DE LOGIQUE MÉTIER**

Voici les services métier pour gérer la logique de votre application ArtSpark Studio Canvas.

---

## 👤 **USER SERVICE**

**Chemin :** `src/main/java/com/artspark/service/UserService.java`

```java
package com.artspark.service;

import com.artspark.entity.User;
import com.artspark.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé: " + email));
    }
    
    // Créer un nouvel utilisateur
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Un nom d'utilisateur existe déjà");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    
    // Trouver un utilisateur par email
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    // Trouver un utilisateur par ID
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    // Trouver tous les utilisateurs
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    // Trouver tous les administrateurs
    public List<User> findAllAdmins() {
        return userRepository.findAllAdmins();
    }
    
    // Mettre à jour un utilisateur
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        user.setRole(userDetails.getRole());
        
        return userRepository.save(user);
    }
    
    // Supprimer un utilisateur
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Utilisateur non trouvé");
        }
        userRepository.deleteById(id);
    }
    
    // Vérifier les credentials
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
    
    // Encoder un mot de passe
    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }
    
    // Créer un admin par défaut
    public User createDefaultAdmin() {
        if (userRepository.existsByEmail("admin@artspark.com")) {
            return userRepository.findByEmail("admin@artspark.com").orElse(null);
        }
        
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@artspark.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(User.Role.ADMIN);
        
        return userRepository.save(admin);
    }
    
    // Compter les utilisateurs par rôle
    public long countByRole(User.Role role) {
        return userRepository.countByRole(role);
    }
    
    // Rechercher des utilisateurs
    public List<User> searchUsers(String search) {
        return userRepository.findByUsernameOrEmailContaining(search);
    }
}
```

---

## 🎨 **ARTWORK SERVICE**

**Chemin :** `src/main/java/com/artspark/service/ArtworkService.java`

```java
package com.artspark.service;

import com.artspark.entity.Artwork;
import com.artspark.repository.ArtworkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ArtworkService {
    
    @Autowired
    private ArtworkRepository artworkRepository;
    
    private final String uploadDir = "uploads/artworks/";
    
    // Créer une nouvelle œuvre
    public Artwork createArtwork(Artwork artwork) {
        return artworkRepository.save(artwork);
    }
    
    // Trouver toutes les œuvres
    public List<Artwork> findAll() {
        return artworkRepository.findAll();
    }
    
    // Trouver une œuvre par ID
    public Optional<Artwork> findById(Long id) {
        return artworkRepository.findById(id);
    }
    
    // Mettre à jour une œuvre
    public Artwork updateArtwork(Long id, Artwork artworkDetails) {
        Artwork artwork = artworkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Œuvre non trouvée"));
        
        artwork.setTitre(artworkDetails.getTitre());
        artwork.setDescription(artworkDetails.getDescription());
        artwork.setTechnique(artworkDetails.getTechnique());
        artwork.setDimensions(artworkDetails.getDimensions());
        artwork.setAnnee(artworkDetails.getAnnee());
        artwork.setImageUrl(artworkDetails.getImageUrl());
        
        return artworkRepository.save(artwork);
    }
    
    // Supprimer une œuvre
    public void deleteArtwork(Long id) {
        if (!artworkRepository.existsById(id)) {
            throw new RuntimeException("Œuvre non trouvée");
        }
        artworkRepository.deleteById(id);
    }
    
    // Rechercher des œuvres
    public List<Artwork> searchArtworks(String search) {
        return artworkRepository.findBySearchTerm(search);
    }
    
    // Recherche avancée
    public List<Artwork> advancedSearch(String titre, String technique, Integer annee) {
        return artworkRepository.findByAdvancedSearch(titre, technique, annee);
    }
    
    // Trouver les œuvres récentes
    public List<Artwork> findRecentArtworks() {
        return artworkRepository.findRecentArtworks();
    }
    
    // Trouver les œuvres par technique
    public List<Artwork> findByTechnique(String technique) {
        return artworkRepository.findByTechniqueContainingIgnoreCase(technique);
    }
    
    // Trouver les œuvres par année
    public List<Artwork> findByAnnee(Integer annee) {
        return artworkRepository.findByAnnee(annee);
    }
    
    // Upload d'image
    public String uploadImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Fichier vide");
        }
        
        // Créer le dossier d'upload s'il n'existe pas
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Générer un nom de fichier unique
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = System.currentTimeMillis() + "_" + originalFilename;
        
        // Sauvegarder le fichier
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        return "/api/artworks/images/" + filename;
    }
    
    // Obtenir les statistiques des œuvres
    public List<Object[]> getArtworkStatistics() {
        return artworkRepository.countByTechnique();
    }
    
    // Obtenir les statistiques par année
    public List<Object[]> getYearlyStatistics() {
        return artworkRepository.countByAnnee();
    }
    
    // Pagination des œuvres
    public Page<Artwork> findAllPaginated(Pageable pageable) {
        return artworkRepository.findAll(pageable);
    }
}
```

---

## 💬 **REVIEW SERVICE**

**Chemin :** `src/main/java/com/artspark/service/ReviewService.java`

```java
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
```

---

## 📧 **CONTACT SERVICE**

**Chemin :** `src/main/java/com/artspark/service/ContactService.java`

```java
package com.artspark.service;

import com.artspark.entity.ContactMessage;
import com.artspark.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ContactService {
    
    @Autowired
    private ContactMessageRepository contactMessageRepository;
    
    // Créer un nouveau message de contact
    public ContactMessage createMessage(ContactMessage message) {
        return contactMessageRepository.save(message);
    }
    
    // Trouver tous les messages
    public List<ContactMessage> findAll() {
        return contactMessageRepository.findRecentMessages();
    }
    
    // Trouver un message par ID
    public Optional<ContactMessage> findById(Long id) {
        return contactMessageRepository.findById(id);
    }
    
    // Trouver tous les messages non lus
    public List<ContactMessage> findUnreadMessages() {
        return contactMessageRepository.findByIsReadFalse();
    }
    
    // Trouver tous les messages non répondu
    public List<ContactMessage> findUnrespondedMessages() {
        return contactMessageRepository.findByIsRespondedFalse();
    }
    
    // Marquer un message comme lu
    public ContactMessage markAsRead(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message non trouvé"));
        
        message.setIsRead(true);
        return contactMessageRepository.save(message);
    }
    
    // Marquer un message comme répondu
    public ContactMessage markAsResponded(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message non trouvé"));
        
        message.setIsResponded(true);
        return contactMessageRepository.save(message);
    }
    
    // Supprimer un message
    public void deleteMessage(Long id) {
        if (!contactMessageRepository.existsById(id)) {
            throw new RuntimeException("Message non trouvé");
        }
        contactMessageRepository.deleteById(id);
    }
    
    // Rechercher des messages
    public List<ContactMessage> searchMessages(String search) {
        return contactMessageRepository.findBySearchTerm(search);
    }
    
    // Trouver les messages par email
    public List<ContactMessage> findByEmail(String email) {
        return contactMessageRepository.findByEmail(email);
    }
    
    // Compter les messages non lus
    public long countUnreadMessages() {
        return contactMessageRepository.countByIsReadFalse();
    }
    
    // Compter les messages non répondu
    public long countUnrespondedMessages() {
        return contactMessageRepository.countByIsRespondedFalse();
    }
    
    // Trouver les messages les plus anciens non lus
    public List<ContactMessage> findOldestUnreadMessages() {
        return contactMessageRepository.findOldestUnreadMessages();
    }
    
    // Obtenir les statistiques des messages
    public List<Object[]> getMessageStatistics() {
        return contactMessageRepository.countByReadStatus();
    }
}
```

---

## 📊 **STATS SERVICE**

**Chemin :** `src/main/java/com/artspark/service/StatsService.java`

```java
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
```

**Ces services métier sont maintenant prêts pour votre backend Spring Boot !** 🚀

Voulez-vous que je continue avec les contrôleurs REST ?
