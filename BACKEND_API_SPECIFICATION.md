# 🚀 Spécification API Backend - ArtSpark Studio Canvas

## 📋 Vue d'ensemble

Cette documentation fournit toutes les routes, modèles de données et fonctionnalités nécessaires pour développer un backend compatible avec le frontend React ArtSpark Studio Canvas.

## 🗄️ Base de données : MySQL
- **Type :** MySQL Database
- **Port :** 3306 (par défaut)
- **Tables :** users, artworks, reviews, comments

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

#### **1.1 Connexion**
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

#### **1.2 Validation Token**
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

#### **1.3 Création Admin (Setup initial)**
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
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    public enum Role {
        ADMIN
    }
}
```

## 🎨 2. GESTION DES ŒUVRES D'ART

### **Base URL :** `http://localhost:8091/api/artworks`

#### **2.1 Récupérer toutes les œuvres**
```http
GET /artworks
```

**Réponse :**
```json
[
  {
    "id": 1,
    "title": "Harmonie Nocturne",
    "description": "Une œuvre abstraite qui capture l'essence de la nuit",
    "imageUrl": "/artwork1.JPG",
    "technique": "Peinture acrylique",
    "dimensions": "80x60 cm",
    "year": 2024,
    "category": "Abstrait",
    "available": true,
    "featured": true,
    "tags": ["abstrait", "nuit", "mystère"],
    "materials": ["Acrylique", "Toile"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### **2.2 Récupérer une œuvre par ID**
```http
GET /artworks/{id}
```

#### **2.3 Créer une nouvelle œuvre**
```http
POST /artworks
Content-Type: application/json

{
  "title": "Nouvelle Œuvre",
  "description": "Description de l'œuvre",
  "imageUrl": "/nouvelle-oeuvre.jpg",
  "technique": "Peinture à l'huile",
  "dimensions": "100x80 cm",
  "year": 2024,
  "category": "Figuratif",
  "available": true,
  "featured": false,
  "tags": ["figuratif", "portrait"],
  "materials": ["Huile", "Toile"]
}
```

#### **2.4 Modifier une œuvre**
```http
PUT /artworks/{id}
Content-Type: application/json

{
  "title": "Titre modifié",
  "description": "Description modifiée"
}
```

#### **2.5 Supprimer une œuvre**
```http
DELETE /artworks/{id}
```

#### **2.6 Rechercher des œuvres**
```http
GET /artworks/search?q={query}
```

#### **2.7 Filtrer par technique**
```http
GET /artworks/technique/{technique}
```

#### **2.8 Filtrer par année**
```http
GET /artworks/year/{year}
```

#### **2.9 Récupérer les œuvres mises en avant**
```http
GET /artworks/featured
```

#### **2.10 Filtrer par catégorie**
```http
GET /artworks/category/{category}
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
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @NotBlank
    private String imageUrl;
    
    private String technique;
    private String dimensions;
    private Integer year;
    private String category;
    private Boolean available = true;
    private Boolean featured = false;
    
    @ElementCollection
    @CollectionTable(name = "artwork_tags", joinColumns = @JoinColumn(name = "artwork_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "artwork_materials", joinColumns = @JoinColumn(name = "artwork_id"))
    @Column(name = "material")
    private List<String> materials = new ArrayList<>();
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

## 💬 3. GESTION DES AVIS ET COMMENTAIRES

### **Base URL :** `http://localhost:8091/api/reviews`

#### **3.1 Récupérer tous les avis**
```http
GET /reviews
```

#### **3.2 Récupérer les avis d'une œuvre**
```http
GET /reviews/artwork/{artworkId}
```

#### **3.3 Récupérer un avis par ID**
```http
GET /reviews/{id}
```

#### **3.4 Créer un nouvel avis**
```http
POST /reviews
Content-Type: application/json

{
  "artworkId": 1,
  "userName": "Jean Dupont",
  "userEmail": "jean@example.com",
  "rating": 5,
  "comment": "Magnifique œuvre !"
}
```

#### **3.5 Modifier un avis**
```http
PUT /reviews/{id}
Content-Type: application/json

{
  "comment": "Commentaire modifié"
}
```

#### **3.6 Supprimer un avis**
```http
DELETE /reviews/{id}
```

#### **3.7 Marquer un avis comme utile**
```http
POST /reviews/{id}/helpful
```

#### **3.8 Récupérer les statistiques d'avis**
```http
GET /reviews/artwork/{artworkId}/stats
```

**Réponse :**
```json
{
  "average": 4.5,
  "count": 10,
  "distribution": [0, 0, 1, 2, 7]
}
```

#### **3.9 Récupérer les avis d'un utilisateur**
```http
GET /reviews/user/{userEmail}
```

#### **3.10 Vérifier un avis (Admin)**
```http
POST /reviews/{id}/verify
```

### **Modèle Review :**
```java
@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artwork_id", nullable = false)
    private Artwork artwork;
    
    @NotBlank
    private String userName;
    
    @NotBlank
    @Email
    private String userEmail;
    
    @Min(1)
    @Max(5)
    private Integer rating;
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    private Integer helpful = 0;
    private Boolean verified = false;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

## 📞 4. GESTION DES CONTACTS

### **Base URL :** `http://localhost:8091/api/contact`

#### **4.1 Envoyer un message de contact**
```http
POST /contact
Content-Type: application/json

{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "subject": "Demande d'information",
  "message": "Bonjour, j'aimerais en savoir plus sur vos œuvres."
}
```

**Réponse :**
```json
{
  "message": "Message envoyé avec succès",
  "id": 1
}
```

### **Modèle Contact :**
```java
@Entity
@Table(name = "contacts")
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String name;
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String subject;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    private Boolean read = false;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

## 📊 5. STATISTIQUES

### **Base URL :** `http://localhost:8091/api/stats`

#### **5.1 Récupérer les statistiques générales**
```http
GET /stats
```

**Réponse :**
```json
{
  "totalArtworks": 25,
  "totalReviews": 150,
  "averageRating": 4.3,
  "totalContacts": 45,
  "featuredArtworks": 8,
  "categories": {
    "Abstrait": 10,
    "Figuratif": 8,
    "Paysage": 7
  },
  "techniques": {
    "Peinture acrylique": 12,
    "Peinture à l'huile": 8,
    "Aquarelle": 5
  }
}
```

## 🗄️ 6. STRUCTURE BASE DE DONNÉES MYSQL

### **Script SQL de création :**

```sql
-- Table des utilisateurs
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN') NOT NULL DEFAULT 'ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des œuvres d'art
CREATE TABLE artworks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255) NOT NULL,
    technique VARCHAR(255),
    dimensions VARCHAR(100),
    year INT,
    category VARCHAR(100),
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

-- Table des avis
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    artwork_id BIGINT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    helpful INT DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Table des contacts
CREATE TABLE contacts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les performances
CREATE INDEX idx_artworks_title ON artworks(title);
CREATE INDEX idx_artworks_category ON artworks(category);
CREATE INDEX idx_artworks_featured ON artworks(featured);
CREATE INDEX idx_reviews_artwork_id ON reviews(artwork_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_contacts_email ON contacts(email);
```

## 🔧 7. CONFIGURATION SPRING BOOT

### **application.yml :**
```yaml
server:
  port: 8091

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/artspark_studio
    username: your_username
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true

  security:
    jwt:
      secret: your-secret-key-here
      expiration: 86400000 # 24 hours

logging:
  level:
    com.portfolio.artiste: DEBUG
    org.springframework.security: DEBUG
```

### **CORS Configuration :**
```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:8081", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 🚀 8. ENDPOINTS COMPLETS REQUIS

### **Authentification :**
- `POST /api/auth/login` - Connexion
- `POST /api/auth/validate` - Validation token
- `POST /api/auth/create-admin` - Création admin (setup)

### **Œuvres d'art :**
- `GET /api/artworks` - Liste toutes les œuvres
- `GET /api/artworks/{id}` - Détail d'une œuvre
- `POST /api/artworks` - Créer une œuvre
- `PUT /api/artworks/{id}` - Modifier une œuvre
- `DELETE /api/artworks/{id}` - Supprimer une œuvre
- `GET /api/artworks/search?q={query}` - Rechercher
- `GET /api/artworks/technique/{technique}` - Filtrer par technique
- `GET /api/artworks/year/{year}` - Filtrer par année
- `GET /api/artworks/featured` - Œuvres mises en avant
- `GET /api/artworks/category/{category}` - Filtrer par catégorie

### **Avis :**
- `GET /api/reviews` - Liste tous les avis
- `GET /api/reviews/{id}` - Détail d'un avis
- `GET /api/reviews/artwork/{artworkId}` - Avis d'une œuvre
- `POST /api/reviews` - Créer un avis
- `PUT /api/reviews/{id}` - Modifier un avis
- `DELETE /api/reviews/{id}` - Supprimer un avis
- `POST /api/reviews/{id}/helpful` - Marquer comme utile
- `GET /api/reviews/artwork/{artworkId}/stats` - Statistiques avis
- `GET /api/reviews/user/{userEmail}` - Avis d'un utilisateur
- `POST /api/reviews/{id}/verify` - Vérifier avis (admin)

### **Contact :**
- `POST /api/contact` - Envoyer message

### **Statistiques :**
- `GET /api/stats` - Statistiques générales

## ✅ 9. TESTS DE VALIDATION

### **Test de connexion :**
```bash
curl -X POST http://localhost:8091/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@portfolio.com","password":"admin123"}'
```

### **Test création admin :**
```bash
curl -X POST http://localhost:8091/api/auth/create-admin
```

### **Test récupération œuvres :**
```bash
curl -X GET http://localhost:8091/api/artworks
```

### **Test création avis :**
```bash
curl -X POST http://localhost:8091/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"artworkId":1,"userName":"Test","userEmail":"test@test.com","rating":5,"comment":"Test"}'
```

## 🎯 10. NOTES IMPORTANTES

1. **Authentification :** Utiliser JWT avec Bearer token
2. **CORS :** Configurer pour `http://localhost:8081` (frontend)
3. **Validation :** Valider tous les inputs avec `@Valid`
4. **Gestion d'erreurs :** Retourner des messages d'erreur clairs
5. **Sécurité :** Protéger les routes admin avec `@PreAuthorize`
6. **Logs :** Activer les logs DEBUG pour le développement
7. **Base de données :** Utiliser MySQL avec les tables spécifiées
8. **Port :** Backend sur le port 8091

Cette spécification garantit une compatibilité parfaite avec le frontend React ArtSpark Studio Canvas ! 🚀