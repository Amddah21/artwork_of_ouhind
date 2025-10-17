# 🚀 ROUTES BACKEND COMPLÈTES - Spring Boot

## 📋 **INFORMATIONS GÉNÉRALES**
- **Base URL**: `http://localhost:8091/api`
- **Base de données**: MySQL
- **Authentification**: JWT (JSON Web Tokens)
- **Format**: JSON

---

## 🔐 **AUTHENTIFICATION** (`/api/auth`)

### 1. **Connexion**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@portfolio.com",
  "password": "admin123"
}
```

**Réponse:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@portfolio.com",
    "role": "ADMIN"
  }
}
```

### 2. **Validation du token**
```http
POST /api/auth/validate
Authorization: Bearer {token}
```

**Réponse:**
```json
{
  "valid": true
}
```

### 3. **Créer un admin** (⚠️ À utiliser UNE SEULE FOIS)
```http
POST /api/auth/create-admin
```

**Réponse:**
```json
{
  "message": "Admin créé avec succès",
  "username": "admin",
  "email": "admin@portfolio.com"
}
```

---

## 🎨 **GESTION DES ŒUVRES** (`/api/artworks`)

### **ROUTES PUBLIQUES** (sans authentification)

#### 1. **Liste de toutes les œuvres**
```http
GET /api/artworks
```

**Réponse:**
```json
[
  {
    "id": 1,
    "titre": "Mon Tableau",
    "description": "Description de l'œuvre",
    "technique": "Huile sur toile",
    "dimensions": "100x80 cm",
    "annee": 2024,
    "imageUrl": "/api/artworks/images/mon-tableau.jpg"
  }
]
```

#### 2. **Détail d'une œuvre**
```http
GET /api/artworks/{id}
```

**Réponse:**
```json
{
  "id": 1,
  "titre": "Mon Tableau",
  "description": "Description de l'œuvre",
  "technique": "Huile sur toile",
  "dimensions": "100x80 cm",
  "annee": 2024,
  "imageUrl": "/api/artworks/images/mon-tableau.jpg"
}
```

#### 3. **Recherche d'œuvres**
```http
GET /api/artworks/search?q={terme}
```

#### 4. **Récupération d'images**
```http
GET /api/artworks/images/{fileName}
```

---

### **ROUTES ADMIN** (avec authentification JWT)

#### 5. **Créer une œuvre**
```http
POST /api/artworks
Authorization: Bearer {token}
Content-Type: application/json

{
  "titre": "Nouvelle Œuvre",
  "description": "Description de la nouvelle œuvre",
  "technique": "Acrylique sur toile",
  "dimensions": "120x90 cm",
  "annee": 2024,
  "imageUrl": "/api/artworks/images/nouvelle-oeuvre.jpg"
}
```

#### 6. **Upload d'image**
```http
POST /api/artworks/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "file": [fichier image]
}
```

**Réponse:**
```json
{
  "imageUrl": "/api/artworks/images/filename.jpg"
}
```

#### 7. **Modifier une œuvre**
```http
PUT /api/artworks/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "titre": "Titre modifié",
  "description": "Description modifiée",
  "technique": "Technique modifiée",
  "dimensions": "Dimensions modifiées",
  "annee": 2024,
  "imageUrl": "/api/artworks/images/image-modifiee.jpg"
}
```

#### 8. **Supprimer une œuvre**
```http
DELETE /api/artworks/{id}
Authorization: Bearer {token}
```

---

## 💬 **COMMENTAIRES** (`/api/reviews`)

### **ROUTES PUBLIQUES**

#### 1. **Liste des commentaires**
```http
GET /api/reviews
```

**Réponse:**
```json
[
  {
    "id": 1,
    "authorName": "Jean Dupont",
    "rating": 5,
    "comment": "Magnifique œuvre !",
    "helpful": 3,
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

#### 2. **Ajouter un commentaire**
```http
POST /api/reviews
Content-Type: application/json

{
  "authorName": "Jean Dupont",
  "rating": 5,
  "comment": "Magnifique œuvre !"
}
```

#### 3. **Marquer comme utile**
```http
POST /api/reviews/{id}/helpful
```

---

## 📞 **CONTACT** (`/api/contact`)

#### 1. **Envoyer un message**
```http
POST /api/contact
Content-Type: application/json

{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "subject": "Demande d'information",
  "message": "Bonjour, j'aimerais en savoir plus sur vos œuvres."
}
```

**Réponse:**
```json
{
  "message": "Message envoyé avec succès"
}
```

---

## 📊 **STATISTIQUES** (`/api/stats`)

#### 1. **Statistiques générales**
```http
GET /api/stats
```

**Réponse:**
```json
{
  "totalArtworks": 25,
  "totalReviews": 150,
  "averageRating": 4.8,
  "totalViews": 1250
}
```

---

## 🗄️ **STRUCTURE DE LA BASE DE DONNÉES**

### **Table `users`**
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN') DEFAULT 'ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Table `artworks`**
```sql
CREATE TABLE artworks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    technique VARCHAR(255),
    dimensions VARCHAR(100),
    annee INT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Table `reviews`**
```sql
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    helpful INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Table `contact_messages`**
```sql
CREATE TABLE contact_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 **CONFIGURATION SPRING BOOT**

### **application.properties**
```properties
# Server
server.port=8091

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/portfolio_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# CORS
spring.web.cors.allowed-origins=http://localhost:8081
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

---

## 🧪 **TESTS DE CONNEXION**

### **Test de base**
```bash
curl http://localhost:8091/api/artworks
```

### **Test d'authentification**
```bash
curl -X POST http://localhost:8091/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@portfolio.com","password":"admin123"}'
```

### **Test de création d'œuvre**
```bash
curl -X POST http://localhost:8091/api/artworks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "titre": "Test",
    "description": "Description test",
    "technique": "Acrylique",
    "dimensions": "100x80 cm",
    "annee": 2024,
    "imageUrl": "/test.jpg"
  }'
```

---

## ⚠️ **IMPORTANT**

1. **CORS**: Assurez-vous que CORS est configuré pour `http://localhost:8081`
2. **JWT**: Le token doit être inclus dans l'en-tête `Authorization: Bearer {token}`
3. **Content-Type**: Utilisez `application/json` pour les requêtes JSON
4. **Multipart**: Utilisez `multipart/form-data` pour l'upload de fichiers
5. **Port**: Le backend doit tourner sur le port **8091**

---

## 🎯 **PRIORITÉS D'IMPLÉMENTATION**

1. ✅ **Authentification** (`/api/auth/*`)
2. ✅ **CRUD Œuvres** (`/api/artworks/*`)
3. 🔄 **Upload d'images** (`/api/artworks/upload`)
4. 🔄 **Commentaires** (`/api/reviews/*`)
5. 🔄 **Contact** (`/api/contact`)
6. 🔄 **Statistiques** (`/api/stats`)

**Toutes ces routes sont nécessaires pour que votre frontend fonctionne parfaitement !** 🚀
