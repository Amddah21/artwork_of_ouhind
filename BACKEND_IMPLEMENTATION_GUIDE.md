# 🚀 Guide d'implémentation Backend Spring Boot - Endpoints Manquants

## 📋 Problème identifié

Votre frontend React essaie de communiquer avec le backend Spring Boot, mais certains endpoints ne sont pas encore implémentés. Voici ce qui doit être ajouté à votre backend.

## 🔧 Endpoints à implémenter dans votre backend Spring Boot

### 1. **ArtworkController.java** - À créer/compléter

```java
package com.portfolio.artiste.controller;

import com.portfolio.artiste.model.Artwork;
import com.portfolio.artiste.service.ArtworkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/artworks")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:8081", "http://localhost:3000"})
public class ArtworkController {

    private final ArtworkService artworkService;

    // GET /api/artworks - Récupérer toutes les œuvres
    @GetMapping
    public ResponseEntity<List<Artwork>> getAllArtworks() {
        List<Artwork> artworks = artworkService.getAllArtworks();
        return ResponseEntity.ok(artworks);
    }

    // GET /api/artworks/{id} - Récupérer une œuvre par ID
    @GetMapping("/{id}")
    public ResponseEntity<Artwork> getArtworkById(@PathVariable Long id) {
        Artwork artwork = artworkService.getArtworkById(id);
        if (artwork != null) {
            return ResponseEntity.ok(artwork);
        }
        return ResponseEntity.notFound().build();
    }

    // POST /api/artworks - Créer une nouvelle œuvre (Admin)
    @PostMapping
    public ResponseEntity<Artwork> createArtwork(@Valid @RequestBody Artwork artwork) {
        Artwork createdArtwork = artworkService.createArtwork(artwork);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdArtwork);
    }

    // PUT /api/artworks/{id} - Modifier une œuvre (Admin)
    @PutMapping("/{id}")
    public ResponseEntity<Artwork> updateArtwork(@PathVariable Long id, @Valid @RequestBody Artwork artwork) {
        Artwork updatedArtwork = artworkService.updateArtwork(id, artwork);
        if (updatedArtwork != null) {
            return ResponseEntity.ok(updatedArtwork);
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE /api/artworks/{id} - Supprimer une œuvre (Admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtwork(@PathVariable Long id) {
        boolean deleted = artworkService.deleteArtwork(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // POST /api/artworks/upload - Upload d'image (Admin)
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = artworkService.uploadImage(file);
            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/artworks/search - Rechercher des œuvres
    @GetMapping("/search")
    public ResponseEntity<List<Artwork>> searchArtworks(@RequestParam String q) {
        List<Artwork> artworks = artworkService.searchArtworks(q);
        return ResponseEntity.ok(artworks);
    }

    // GET /api/artworks/technique/{technique} - Filtrer par technique
    @GetMapping("/technique/{technique}")
    public ResponseEntity<List<Artwork>> getArtworksByTechnique(@PathVariable String technique) {
        List<Artwork> artworks = artworkService.getArtworksByTechnique(technique);
        return ResponseEntity.ok(artworks);
    }

    // GET /api/artworks/year/{year} - Filtrer par année
    @GetMapping("/year/{year}")
    public ResponseEntity<List<Artwork>> getArtworksByYear(@PathVariable Integer year) {
        List<Artwork> artworks = artworkService.getArtworksByYear(year);
        return ResponseEntity.ok(artworks);
    }

    // GET /api/artworks/featured - Récupérer les œuvres mises en avant
    @GetMapping("/featured")
    public ResponseEntity<List<Artwork>> getFeaturedArtworks() {
        List<Artwork> artworks = artworkService.getFeaturedArtworks();
        return ResponseEntity.ok(artworks);
    }

    // GET /api/artworks/category/{category} - Filtrer par catégorie
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Artwork>> getArtworksByCategory(@PathVariable String category) {
        List<Artwork> artworks = artworkService.getArtworksByCategory(category);
        return ResponseEntity.ok(artworks);
    }

    // GET /api/artworks/images/{fileName} - Récupérer une image
    @GetMapping("/images/{fileName}")
    public ResponseEntity<byte[]> getImage(@PathVariable String fileName) {
        try {
            byte[] imageBytes = artworkService.getImageBytes(fileName);
            return ResponseEntity.ok()
                .header("Content-Type", "image/jpeg")
                .body(imageBytes);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
```

### 2. **ArtworkService.java** - À créer

```java
package com.portfolio.artiste.service;

import com.portfolio.artiste.model.Artwork;
import com.portfolio.artiste.repository.ArtworkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArtworkService {

    private final ArtworkRepository artworkRepository;
    private final String UPLOAD_DIR = "uploads/images/";

    public List<Artwork> getAllArtworks() {
        return artworkRepository.findAll();
    }

    public Artwork getArtworkById(Long id) {
        return artworkRepository.findById(id).orElse(null);
    }

    public Artwork createArtwork(Artwork artwork) {
        return artworkRepository.save(artwork);
    }

    public Artwork updateArtwork(Long id, Artwork artwork) {
        Optional<Artwork> existingArtwork = artworkRepository.findById(id);
        if (existingArtwork.isPresent()) {
            artwork.setId(id);
            return artworkRepository.save(artwork);
        }
        return null;
    }

    public boolean deleteArtwork(Long id) {
        if (artworkRepository.existsById(id)) {
            artworkRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public String uploadImage(MultipartFile file) throws IOException {
        // Créer le dossier s'il n'existe pas
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Générer un nom de fichier unique
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        // Sauvegarder le fichier
        Files.copy(file.getInputStream(), filePath);

        return "/api/artworks/images/" + fileName;
    }

    public byte[] getImageBytes(String fileName) throws IOException {
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        return Files.readAllBytes(filePath);
    }

    public List<Artwork> searchArtworks(String query) {
        return artworkRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    public List<Artwork> getArtworksByTechnique(String technique) {
        return artworkRepository.findByTechniqueIgnoreCase(technique);
    }

    public List<Artwork> getArtworksByYear(Integer year) {
        return artworkRepository.findByYear(year);
    }

    public List<Artwork> getFeaturedArtworks() {
        return artworkRepository.findByFeaturedTrue();
    }

    public List<Artwork> getArtworksByCategory(String category) {
        return artworkRepository.findByCategoryIgnoreCase(category);
    }
}
```

### 3. **ArtworkRepository.java** - À créer

```java
package com.portfolio.artiste.repository;

import com.portfolio.artiste.model.Artwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    
    List<Artwork> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
    
    List<Artwork> findByTechniqueIgnoreCase(String technique);
    
    List<Artwork> findByYear(Integer year);
    
    List<Artwork> findByFeaturedTrue();
    
    List<Artwork> findByCategoryIgnoreCase(String category);
}
```

### 4. **Artwork.java** - Modèle à mettre à jour

```java
package com.portfolio.artiste.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "artworks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Artwork {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le titre est obligatoire")
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @NotBlank(message = "L'URL de l'image est obligatoire")
    @Column(name = "image_url", nullable = false)
    private String imageUrl;
    
    @NotBlank(message = "La catégorie est obligatoire")
    @Column(nullable = false)
    private String category;
    
    @NotNull(message = "Le prix est obligatoire")
    @Positive(message = "Le prix doit être positif")
    private Double price;
    
    private String technique;
    private String dimensions;
    private Integer year;
    private Boolean available = true;
    private Boolean featured = false;
    
    @ElementCollection
    @CollectionTable(name = "artwork_tags", joinColumns = @JoinColumn(name = "artwork_id"))
    @Column(name = "tag")
    private List<String> tags;
    
    @ElementCollection
    @CollectionTable(name = "artwork_materials", joinColumns = @JoinColumn(name = "artwork_id"))
    @Column(name = "material")
    private List<String> materials;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

## 🗄️ Script SQL pour créer les tables

```sql
-- Table des œuvres d'art
CREATE TABLE artworks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    technique VARCHAR(255),
    dimensions VARCHAR(100),
    year INT,
    available BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des tags des œuvres
CREATE TABLE artwork_tags (
    artwork_id BIGINT,
    tag VARCHAR(255),
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Table des matériaux des œuvres
CREATE TABLE artwork_materials (
    artwork_id BIGINT,
    material VARCHAR(255),
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Index pour les performances
CREATE INDEX idx_artworks_title ON artworks(title);
CREATE INDEX idx_artworks_category ON artworks(category);
CREATE INDEX idx_artworks_featured ON artworks(featured);
CREATE INDEX idx_artworks_year ON artworks(year);
CREATE INDEX idx_artworks_technique ON artworks(technique);
```

## 🔧 Configuration Spring Boot

### **application.yml** - Ajouter la configuration de fichiers

```yaml
spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB
  web:
    resources:
      static-locations: classpath:/static/,file:uploads/
```

## 🚀 Étapes d'implémentation

1. **Créer les fichiers** ci-dessus dans votre projet Spring Boot
2. **Exécuter le script SQL** pour créer les tables
3. **Redémarrer votre backend** Spring Boot
4. **Tester les endpoints** avec Postman ou curl
5. **Vérifier dans votre frontend** que les opérations fonctionnent

## ✅ Test des endpoints

Une fois implémenté, vous pourrez tester :

```bash
# Créer une œuvre
curl -X POST http://localhost:8091/api/artworks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test","description":"Test","category":"Test","price":100,"imageUrl":"/test.jpg"}'

# Récupérer toutes les œuvres
curl http://localhost:8091/api/artworks

# Supprimer une œuvre
curl -X DELETE http://localhost:8091/api/artworks/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Une fois ces endpoints implémentés, votre frontend pourra communiquer avec la base de données MySQL via Spring Boot ! 🎨🚀
