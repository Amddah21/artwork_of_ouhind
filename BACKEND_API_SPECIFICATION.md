# 🚀 Spécification API Backend - ArtSpark Studio Canvas

## 📋 Vue d'ensemble

Cette documentation fournit toutes les routes, modèles de données et fonctionnalités nécessaires pour développer un backend compatible avec le frontend React ArtSpark Studio Canvas.

## 🎯 Architecture Frontend

### **Routes Frontend :**
```
/                    → Page d'accueil (Hero + Portfolio + About + Exhibitions + Contact)
/artwork/:id         → Détail d'une œuvre d'art
/gallery/:galleryId  → Galerie par catégorie
/voting              → Système de vote
/comments            → Commentaires
/admin               → Dashboard administrateur (protégé)
```

## 🔐 1. AUTHENTIFICATION

### **Base URL :** `http://localhost:8091/api/auth`

### **1.1 Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@portfolio.com",
  "password": "admin123"
}
```

**Réponse :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@portfolio.com",
    "role": "ADMIN"
  }
}
```

### **1.2 Validation Token**
```http
POST /api/auth/validate
Authorization: Bearer <token>
```

**Réponse :**
```json
{
  "valid": true
}
```

### **1.3 Création Admin (Setup initial)**
```http
POST /api/auth/create-admin
```

**Réponse :**
```json
{
  "message": "Admin créé avec succès",
  "username": "admin",
  "email": "admin@portfolio.com"
}
```

### **Modèle User :**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(unique = true, nullable = false)
    private String username;
    
    @NotBlank
    @Email
    @Column(unique = true, nullable = false)
    private String email;
    
    @NotBlank
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.ADMIN;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    public enum Role {
        ADMIN, USER
    }
}
```

## 🎨 2. GESTION DES ŒUVRES D'ART

### **Base URL :** `http://localhost:8091/api/artworks`

### **2.1 Récupérer toutes les œuvres**
```http
GET /api/artworks
```

**Réponse :**
```json
[
  {
    "id": 1,
    "title": "Rêve Aquarelle",
    "category": "Aquarelle",
    "image": "/artwork1.JPG",
    "size": "40x60 cm",
    "year": "2023",
    "available": true,
    "description": "Une œuvre délicate capturant l'essence des rêves...",
    "featured": true,
    "tags": ["aquarelle", "abstrait", "coloré"],
    "materials": ["Aquarelle", "Papier Arches"],
    "technique": "Aquarelle sur papier"
  }
]
```

### **2.2 Récupérer une œuvre par ID**
```http
GET /api/artworks/{id}
```

### **2.3 Créer une nouvelle œuvre (Admin)**
```http
POST /api/artworks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Nouvelle Œuvre",
  "category": "Peinture",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "size": "50x70 cm",
  "year": "2024",
  "available": true,
  "description": "Description de l'œuvre...",
  "featured": false,
  "tags": ["moderne", "coloré"],
  "materials": ["Acrylique", "Toile"],
  "technique": "Peinture acrylique"
}
```

### **2.4 Modifier une œuvre (Admin)**
```http
PUT /api/artworks/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Titre modifié",
  "description": "Nouvelle description...",
  // ... autres champs
}
```

### **2.5 Supprimer une œuvre (Admin)**
```http
DELETE /api/artworks/{id}
Authorization: Bearer <token>
```

### **2.6 Filtrer par catégorie**
```http
GET /api/artworks?category=Aquarelle
```

### **2.7 Récupérer les œuvres en vedette**
```http
GET /api/artworks?featured=true
```

### **Modèle Artwork :**
```java
@Entity
@Table(name = "artworks")
public class Artwork {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(nullable = false)
    private String title;
    
    @NotBlank
    @Column(nullable = false)
    private String category;
    
    @Column(columnDefinition = "TEXT")
    private String image; // Base64 ou URL
    
    @Column(nullable = false)
    private String size;
    
    @Column(nullable = false)
    private String year;
    
    @Column(nullable = false)
    private Boolean available = true;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private Boolean featured = false;
    
    @ElementCollection
    @CollectionTable(name = "artwork_tags", joinColumns = @JoinColumn(name = "artwork_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "artwork_materials", joinColumns = @JoinColumn(name = "artwork_id"))
    @Column(name = "material")
    private List<String> materials = new ArrayList<>();
    
    private String technique;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

## 💬 3. SYSTÈME DE COMMENTAIRES

### **Base URL :** `http://localhost:8091/api/reviews`

### **3.1 Ajouter un commentaire**
```http
POST /api/reviews
Content-Type: application/json

{
  "artworkId": 1,
  "rating": 5,
  "comment": "Magnifique œuvre !",
  "authorName": "Jean Dupont",
  "authorEmail": "jean@example.com"
}
```

### **3.2 Récupérer les commentaires d'une œuvre**
```http
GET /api/reviews/artwork/{artworkId}
```

**Réponse :**
```json
[
  {
    "id": "1",
    "artworkId": 1,
    "rating": 5,
    "comment": "Magnifique œuvre !",
    "authorName": "Jean Dupont",
    "date": "2024-01-15T10:30:00Z",
    "helpful": 3,
    "verified": true
  }
]
```

### **3.3 Marquer un commentaire comme utile**
```http
POST /api/reviews/{reviewId}/helpful
```

### **3.4 Supprimer un commentaire (Admin)**
```http
DELETE /api/reviews/{reviewId}
Authorization: Bearer <token>
```

### **Modèle Review :**
```java
@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long artworkId;
    
    @Min(1) @Max(5)
    @Column(nullable = false)
    private Integer rating;
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @NotBlank
    @Column(nullable = false)
    private String authorName;
    
    @Email
    @Column(nullable = false)
    private String authorEmail;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime date;
    
    @Column(nullable = false)
    private Integer helpful = 0;
    
    @Column(nullable = false)
    private Boolean verified = false;
    
    @PrePersist
    protected void onCreate() {
        date = LocalDateTime.now();
    }
}
```

## 📧 4. SYSTÈME DE CONTACT

### **Base URL :** `http://localhost:8091/api/contact`

### **4.1 Envoyer un message de contact**
```http
POST /api/contact
Content-Type: application/json

{
  "name": "Marie Martin",
  "email": "marie@example.com",
  "message": "Bonjour, je suis intéressée par vos œuvres..."
}
```

**Réponse :**
```json
{
  "message": "Message envoyé avec succès",
  "id": 1
}
```

### **4.2 Récupérer les messages (Admin)**
```http
GET /api/contact
Authorization: Bearer <token>
```

### **Modèle Contact :**
```java
@Entity
@Table(name = "contact_messages")
public class ContactMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(nullable = false)
    private String name;
    
    @NotBlank
    @Email
    @Column(nullable = false)
    private String email;
    
    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private Boolean read = false;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

## 📊 5. STATISTIQUES (Admin Dashboard)

### **Base URL :** `http://localhost:8091/api/stats`

### **5.1 Statistiques générales**
```http
GET /api/stats
Authorization: Bearer <token>
```

**Réponse :**
```json
{
  "totalArtworks": 25,
  "availableArtworks": 20,
  "featuredArtworks": 5,
  "totalCategories": 8,
  "totalReviews": 45,
  "averageRating": 4.7,
  "totalContactMessages": 12,
  "unreadMessages": 3
}
```

## 🔧 6. CONFIGURATION TECHNIQUE

### **6.1 CORS Configuration**
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:8081"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```

### **6.2 Sécurité JWT**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/artworks", "/api/reviews/**", "/api/contact").permitAll()
                .requestMatchers("/api/artworks/**", "/api/stats/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

## 📝 7. SCHÉMA DE BASE DE DONNÉES

### **7.1 Tables principales**
```sql
-- Table des utilisateurs
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des œuvres d'art
CREATE TABLE artworks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image TEXT,
    size VARCHAR(50) NOT NULL,
    year VARCHAR(10) NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    technique VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des tags
CREATE TABLE artwork_tags (
    artwork_id BIGINT,
    tag VARCHAR(100),
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Table des matériaux
CREATE TABLE artwork_materials (
    artwork_id BIGINT,
    material VARCHAR(100),
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Table des commentaires
CREATE TABLE reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    artwork_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    helpful INT DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Table des messages de contact
CREATE TABLE contact_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 8. DÉMARRAGE RAPIDE

### **8.1 Configuration Spring Boot**
```properties
# application.properties
server.port=8091
spring.datasource.url=jdbc:mysql://localhost:3306/artspark_db
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=your-secret-key-here
jwt.expiration=86400000
```

### **8.2 Dépendances Maven**
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt</artifactId>
        <version>0.9.1</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

## ✅ 9. CHECKLIST DE COMPATIBILITÉ

### **9.1 Endpoints obligatoires**
- [ ] `POST /api/auth/login` - Connexion
- [ ] `POST /api/auth/validate` - Validation token
- [ ] `POST /api/auth/create-admin` - Création admin
- [ ] `GET /api/artworks` - Liste des œuvres
- [ ] `GET /api/artworks/{id}` - Détail œuvre
- [ ] `POST /api/artworks` - Créer œuvre (Admin)
- [ ] `PUT /api/artworks/{id}` - Modifier œuvre (Admin)
- [ ] `DELETE /api/artworks/{id}` - Supprimer œuvre (Admin)
- [ ] `POST /api/reviews` - Ajouter commentaire
- [ ] `GET /api/reviews/artwork/{id}` - Commentaires œuvre
- [ ] `POST /api/contact` - Message contact
- [ ] `GET /api/stats` - Statistiques (Admin)

### **9.2 Fonctionnalités requises**
- [ ] Authentification JWT
- [ ] CORS configuré pour `http://localhost:8081`
- [ ] Validation des données
- [ ] Gestion des erreurs HTTP
- [ ] Upload d'images (Base64)
- [ ] Filtrage par catégorie
- [ ] Système de rôles (ADMIN/USER)

## 🎯 10. EXEMPLE DE CONTRÔLEUR COMPLET

```java
@RestController
@RequestMapping("/api/artworks")
@CrossOrigin(origins = "http://localhost:8081")
@RequiredArgsConstructor
public class ArtworkController {
    
    private final ArtworkService artworkService;
    
    @GetMapping
    public ResponseEntity<List<Artwork>> getAllArtworks(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean featured) {
        List<Artwork> artworks = artworkService.getAllArtworks(category, featured);
        return ResponseEntity.ok(artworks);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Artwork> getArtworkById(@PathVariable Long id) {
        Artwork artwork = artworkService.getArtworkById(id);
        return ResponseEntity.ok(artwork);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Artwork> createArtwork(@Valid @RequestBody Artwork artwork) {
        Artwork createdArtwork = artworkService.createArtwork(artwork);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdArtwork);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Artwork> updateArtwork(@PathVariable Long id, @Valid @RequestBody Artwork artwork) {
        Artwork updatedArtwork = artworkService.updateArtwork(id, artwork);
        return ResponseEntity.ok(updatedArtwork);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteArtwork(@PathVariable Long id) {
        artworkService.deleteArtwork(id);
        return ResponseEntity.noContent().build();
    }
}
```

## 🎉 Conclusion

Cette spécification fournit tout ce qu'il faut pour développer un backend Spring Boot compatible avec le frontend ArtSpark Studio Canvas. Le backend doit implémenter toutes les routes, modèles de données et fonctionnalités décrites pour assurer une intégration parfaite.

**Bon développement !** 🚀🎨
