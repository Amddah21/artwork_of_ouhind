# 📊 REPOSITORIES JPA - ArtSpark Backend

## 🔍 **REPOSITORIES DE BASE DE DONNÉES**

Voici les repositories JPA pour interagir avec la base de données MySQL.

---

## 👤 **USER REPOSITORY**

**Chemin :** `src/main/java/com/artspark/repository/UserRepository.java`

```java
package com.artspark.repository;

import com.artspark.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Trouver un utilisateur par email
    Optional<User> findByEmail(String email);
    
    // Trouver un utilisateur par nom d'utilisateur
    Optional<User> findByUsername(String username);
    
    // Vérifier si un utilisateur existe par email
    boolean existsByEmail(String email);
    
    // Vérifier si un utilisateur existe par nom d'utilisateur
    boolean existsByUsername(String username);
    
    // Trouver tous les utilisateurs par rôle
    List<User> findByRole(User.Role role);
    
    // Trouver tous les administrateurs
    @Query("SELECT u FROM User u WHERE u.role = 'ADMIN'")
    List<User> findAllAdmins();
    
    // Compter le nombre d'utilisateurs par rôle
    long countByRole(User.Role role);
    
    // Rechercher des utilisateurs par nom ou email
    @Query("SELECT u FROM User u WHERE u.username LIKE %:search% OR u.email LIKE %:search%")
    List<User> findByUsernameOrEmailContaining(@Param("search") String search);
}
```

---

## 🎨 **ARTWORK REPOSITORY**

**Chemin :** `src/main/java/com/artspark/repository/ArtworkRepository.java`

```java
package com.artspark.repository;

import com.artspark.entity.Artwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    
    // Rechercher des œuvres par titre
    List<Artwork> findByTitreContainingIgnoreCase(String titre);
    
    // Rechercher des œuvres par technique
    List<Artwork> findByTechniqueContainingIgnoreCase(String technique);
    
    // Rechercher des œuvres par année
    List<Artwork> findByAnnee(Integer annee);
    
    // Rechercher des œuvres par année (range)
    List<Artwork> findByAnneeBetween(Integer anneeDebut, Integer anneeFin);
    
    // Recherche globale (titre, description, technique)
    @Query("SELECT a FROM Artwork a WHERE " +
           "LOWER(a.titre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.technique) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Artwork> findBySearchTerm(@Param("search") String search);
    
    // Recherche avancée avec filtres
    @Query("SELECT a FROM Artwork a WHERE " +
           "(:titre IS NULL OR LOWER(a.titre) LIKE LOWER(CONCAT('%', :titre, '%'))) AND " +
           "(:technique IS NULL OR LOWER(a.technique) LIKE LOWER(CONCAT('%', :technique, '%'))) AND " +
           "(:annee IS NULL OR a.annee = :annee)")
    List<Artwork> findByAdvancedSearch(@Param("titre") String titre, 
                                      @Param("technique") String technique, 
                                      @Param("annee") Integer annee);
    
    // Trouver les œuvres les plus récentes
    @Query("SELECT a FROM Artwork a ORDER BY a.createdAt DESC")
    List<Artwork> findRecentArtworks();
    
    // Trouver les œuvres par ordre alphabétique
    @Query("SELECT a FROM Artwork a ORDER BY a.titre ASC")
    List<Artwork> findAllOrderByTitre();
    
    // Compter le nombre d'œuvres par technique
    @Query("SELECT a.technique, COUNT(a) FROM Artwork a GROUP BY a.technique")
    List<Object[]> countByTechnique();
    
    // Compter le nombre d'œuvres par année
    @Query("SELECT a.annee, COUNT(a) FROM Artwork a GROUP BY a.annee ORDER BY a.annee DESC")
    List<Object[]> countByAnnee();
}
```

---

## 💬 **REVIEW REPOSITORY**

**Chemin :** `src/main/java/com/artspark/repository/ReviewRepository.java`

```java
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
```

---

## 📧 **CONTACT MESSAGE REPOSITORY**

**Chemin :** `src/main/java/com/artspark/repository/ContactMessageRepository.java`

```java
package com.artspark.repository;

import com.artspark.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    
    // Trouver tous les messages non lus
    List<ContactMessage> findByIsReadFalse();
    
    // Trouver tous les messages non répondu
    List<ContactMessage> findByIsRespondedFalse();
    
    // Trouver tous les messages lus
    List<ContactMessage> findByIsReadTrue();
    
    // Trouver tous les messages répondu
    List<ContactMessage> findByIsRespondedTrue();
    
    // Trouver les messages par email
    List<ContactMessage> findByEmail(String email);
    
    // Trouver les messages par nom
    List<ContactMessage> findByNameContainingIgnoreCase(String name);
    
    // Rechercher des messages par contenu
    @Query("SELECT c FROM ContactMessage c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.subject) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.message) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<ContactMessage> findBySearchTerm(@Param("search") String search);
    
    // Trouver les messages récents
    @Query("SELECT c FROM ContactMessage c ORDER BY c.createdAt DESC")
    List<ContactMessage> findRecentMessages();
    
    // Trouver les messages par période
    @Query("SELECT c FROM ContactMessage c WHERE c.createdAt BETWEEN :startDate AND :endDate ORDER BY c.createdAt DESC")
    List<ContactMessage> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
    
    // Compter les messages non lus
    long countByIsReadFalse();
    
    // Compter les messages non répondu
    long countByIsRespondedFalse();
    
    // Compter les messages par statut
    @Query("SELECT c.isRead, COUNT(c) FROM ContactMessage c GROUP BY c.isRead")
    List<Object[]> countByReadStatus();
    
    // Trouver les messages les plus anciens non lus
    @Query("SELECT c FROM ContactMessage c WHERE c.isRead = false ORDER BY c.createdAt ASC")
    List<ContactMessage> findOldestUnreadMessages();
}
```

---

## 🔧 **REPOSITORY DE BASE**

**Chemin :** `src/main/java/com/artspark/repository/BaseRepository.java`

```java
package com.artspark.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface BaseRepository<T, ID extends Serializable> extends JpaRepository<T, ID> {
    
    // Méthodes communes à tous les repositories
    Optional<T> findByIdAndDeletedFalse(ID id);
    
    List<T> findAllByDeletedFalse();
    
    long countByDeletedFalse();
    
    void softDelete(ID id);
}
```

---

## 📊 **REPOSITORY PERSONNALISÉ**

**Chemin :** `src/main/java/com/artspark/repository/CustomArtworkRepository.java`

```java
package com.artspark.repository;

import com.artspark.entity.Artwork;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomArtworkRepository {
    
    // Recherche paginée avec filtres
    Page<Artwork> findWithFilters(String search, String technique, Integer annee, Pageable pageable);
    
    // Statistiques avancées
    List<Object[]> getArtworkStatistics();
    
    // Recherche avec suggestions
    List<String> getSearchSuggestions(String query, int limit);
    
    // Trouver les œuvres similaires
    List<Artwork> findSimilarArtworks(Long artworkId, int limit);
}
```

**Ces repositories JPA sont maintenant prêts pour votre backend Spring Boot !** 🚀

Voulez-vous que je continue avec les services métier ?
