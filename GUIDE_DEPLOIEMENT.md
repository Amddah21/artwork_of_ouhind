# 🚀 GUIDE DE DÉPLOIEMENT - ArtSpark Backend

## 📋 **GUIDE COMPLET DE DÉPLOIEMENT**

Voici le guide complet pour déployer votre backend Spring Boot ArtSpark Studio Canvas.

---

## 🛠️ **PRÉREQUIS**

### **1. Java 17+**
```bash
# Vérifier la version Java
java -version

# Si Java n'est pas installé, télécharger depuis:
# https://adoptium.net/
```

### **2. MySQL 8.0+**
```bash
# Vérifier MySQL
mysql --version

# Démarrer MySQL
# Windows: Services -> MySQL
# Linux: sudo systemctl start mysql
# macOS: brew services start mysql
```

### **3. Maven 3.6+**
```bash
# Vérifier Maven
mvn --version

# Si Maven n'est pas installé:
# Windows: https://maven.apache.org/download.cgi
# Linux: sudo apt install maven
# macOS: brew install maven
```

---

## 🗄️ **CONFIGURATION BASE DE DONNÉES**

### **1. Créer la base de données**
```sql
-- Se connecter à MySQL
mysql -u root -p

-- Créer la base de données
CREATE DATABASE artspark_db;
USE artspark_db;

-- Créer les tables
SOURCE schema.sql;
```

### **2. Script SQL complet**
**Chemin :** `src/main/resources/schema.sql`

```sql
-- Création de la base de données
CREATE DATABASE IF NOT EXISTS artspark_db;
USE artspark_db;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'USER') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des œuvres
CREATE TABLE IF NOT EXISTS artworks (
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

-- Table des commentaires/avis
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    helpful INT DEFAULT 0,
    artwork_id BIGINT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_responded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertion de l'admin par défaut
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@artspark.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'ADMIN')
ON DUPLICATE KEY UPDATE username=username;
```

---

## ⚙️ **CONFIGURATION APPLICATION**

### **1. Application Properties**
**Chemin :** `src/main/resources/application.properties`

```properties
# Configuration du serveur
server.port=8091
server.servlet.context-path=/

# Configuration de la base de données MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/artspark_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Configuration JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.use_sql_comments=true

# Configuration CORS
spring.web.cors.allowed-origins=http://localhost:8081,http://localhost:3000
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS,PATCH
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
spring.web.cors.max-age=3600

# Configuration JWT
jwt.secret=ArtSparkStudioCanvasSecretKey2024VerySecureAndLongEnoughForHS512Algorithm
jwt.expiration=86400000

# Configuration upload de fichiers
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
spring.servlet.multipart.enabled=true

# Logging
logging.level.com.artspark=DEBUG
logging.level.org.springframework.web.cors=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# Configuration de développement
spring.devtools.restart.enabled=true
spring.devtools.livereload.enabled=true
```

---

## 🚀 **DÉPLOIEMENT**

### **1. Cloner et configurer le projet**
```bash
# Créer le dossier du projet
mkdir artspark-backend
cd artspark-backend

# Initialiser Maven
mvn archetype:generate -DgroupId=com.artspark -DartifactId=artspark-backend -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

### **2. Structure des dossiers**
```
artspark-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── artspark/
│   │   │           ├── ArtsparkBackendApplication.java
│   │   │           ├── config/
│   │   │           ├── controller/
│   │   │           ├── dto/
│   │   │           ├── entity/
│   │   │           ├── repository/
│   │   │           ├── service/
│   │   │           └── exception/
│   │   └── resources/
│   │       ├── application.properties
│   │       └── schema.sql
│   └── test/
├── pom.xml
└── README.md
```

### **3. Compiler et démarrer**
```bash
# Compiler le projet
mvn clean compile

# Démarrer l'application
mvn spring-boot:run

# Ou créer un JAR
mvn clean package
java -jar target/artspark-backend-1.0.0.jar
```

---

## 🧪 **TESTS DE CONNEXION**

### **1. Test de base**
```bash
# Vérifier que le serveur démarre
curl http://localhost:8091/api/auth/create-admin

# Réponse attendue:
# {"message":"Admin créé avec succès","username":"admin","email":"admin@artspark.com"}
```

### **2. Test de connexion**
```bash
# Test de login
curl -X POST http://localhost:8091/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@artspark.com","password":"admin123"}'

# Réponse attendue:
# {"token":"eyJhbGciOiJIUzUxMiJ9...","type":"Bearer","username":"admin","email":"admin@artspark.com","role":"ADMIN"}
```

### **3. Test des œuvres**
```bash
# Récupérer toutes les œuvres
curl http://localhost:8091/api/artworks

# Réponse attendue:
# []
```

### **4. Test CORS depuis le frontend**
```javascript
// Test depuis le navigateur (console)
fetch('http://localhost:8091/api/artworks', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include'
})
.then(response => response.json())
.then(data => console.log(data));
```

---

## 🔧 **CONFIGURATION FRONTEND**

### **1. Mettre à jour l'API Service**
Vérifiez que votre `src/lib/api.ts` pointe vers le bon port :

```typescript
const API_BASE_URL = 'http://localhost:8091/api';
```

### **2. Tester la connexion**
```bash
# Démarrer le frontend
npm run dev

# Ouvrir http://localhost:8081
# Aller dans Admin Dashboard
# Tester la connexion
```

---

## 🐛 **DÉPANNAGE**

### **1. Erreur de connexion à la base de données**
```bash
# Vérifier que MySQL est démarré
mysql -u root -p

# Vérifier la base de données
SHOW DATABASES;
USE artspark_db;
SHOW TABLES;
```

### **2. Erreur CORS**
```bash
# Vérifier les logs du backend
# Chercher les erreurs CORS dans les logs

# Vérifier que le frontend est sur le bon port
# http://localhost:8081 (pas 3000)
```

### **3. Erreur JWT**
```bash
# Vérifier la configuration JWT
# Vérifier que le secret est assez long (64+ caractères)

# Tester la validation du token
curl -X POST http://localhost:8091/api/auth/validate \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

### **4. Port déjà utilisé**
```bash
# Vérifier les ports utilisés
netstat -ano | findstr :8091

# Changer le port dans application.properties
server.port=8092
```

---

## 📊 **MONITORING**

### **1. Logs**
```bash
# Suivre les logs en temps réel
tail -f logs/application.log

# Ou dans la console Maven
mvn spring-boot:run
```

### **2. Base de données**
```sql
-- Vérifier les utilisateurs
SELECT * FROM users;

-- Vérifier les œuvres
SELECT * FROM artworks;

-- Vérifier les avis
SELECT * FROM reviews;

-- Vérifier les messages
SELECT * FROM contact_messages;
```

---

## 🚀 **DÉPLOIEMENT EN PRODUCTION**

### **1. Configuration production**
**Chemin :** `src/main/resources/application-prod.properties`

```properties
# Configuration production
spring.profiles.active=prod
server.port=8091

# Base de données production
spring.datasource.url=jdbc:mysql://localhost:3306/artspark_prod
spring.datasource.username=artspark_user
spring.datasource.password=SECURE_PASSWORD

# JWT production
jwt.secret=PRODUCTION_SECRET_KEY_VERY_LONG_AND_SECURE_2024
jwt.expiration=3600000

# Logging production
logging.level.com.artspark=INFO
logging.level.org.springframework.security=WARN
logging.level.org.hibernate.SQL=WARN
```

### **2. Build production**
```bash
# Build avec profil production
mvn clean package -Pprod

# Déployer le JAR
java -jar target/artspark-backend-1.0.0.jar --spring.profiles.active=prod
```

---

## ✅ **CHECKLIST DE DÉPLOIEMENT**

- [ ] Java 17+ installé
- [ ] MySQL 8.0+ installé et démarré
- [ ] Maven 3.6+ installé
- [ ] Base de données `artspark_db` créée
- [ ] Tables créées avec `schema.sql`
- [ ] Admin par défaut créé
- [ ] Configuration `application.properties` correcte
- [ ] CORS configuré pour `http://localhost:8081`
- [ ] JWT secret configuré
- [ ] Backend démarré sur port 8091
- [ ] Frontend configuré pour pointer vers port 8091
- [ ] Tests de connexion réussis
- [ ] Login fonctionnel
- [ ] API endpoints accessibles

**Votre backend Spring Boot ArtSpark Studio Canvas est maintenant prêt !** 🚀

Voulez-vous que je teste la connexion avec votre frontend ?
