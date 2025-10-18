# 🚀 ArtSpark Backend - Spring Boot

## 📋 **DESCRIPTION**

Backend Spring Boot pour l'application ArtSpark Studio Canvas - Plateforme de portfolio d'artiste avec gestion des œuvres, avis et messages de contact.

## 🛠️ **TECHNOLOGIES**

- **Java 17+**
- **Spring Boot 3.2.0**
- **Spring Security + JWT**
- **Spring Data JPA**
- **MySQL 8.0+**
- **Maven**

## 🚀 **DÉMARRAGE RAPIDE**

### **1. Prérequis**
```bash
# Vérifier Java
java -version

# Vérifier MySQL
mysql --version

# Vérifier Maven
mvn --version
```

### **2. Configuration Base de Données**
```sql
-- Créer la base de données
CREATE DATABASE artspark_db;
USE artspark_db;

-- Exécuter le script SQL
SOURCE src/main/resources/schema.sql;
```

### **3. Configuration Application**
```properties
# Vérifier src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/artspark_db
spring.datasource.username=root
spring.datasource.password=
```

### **4. Démarrer l'Application**
```bash
# Compiler
mvn clean compile

# Démarrer
mvn spring-boot:run

# Ou créer un JAR
mvn clean package
java -jar target/artspark-backend-1.0.0.jar
```

## 🌐 **API ENDPOINTS**

### **🔐 Authentification**
```
POST /api/auth/login - Se connecter
POST /api/auth/validate - Valider un token
POST /api/auth/create-admin - Créer l'admin
```

### **🎨 Œuvres**
```
GET /api/artworks - Toutes les œuvres
GET /api/artworks/{id} - Œuvre par ID
GET /api/artworks/search - Recherche
POST /api/artworks - Créer (ADMIN)
PUT /api/artworks/{id} - Modifier (ADMIN)
DELETE /api/artworks/{id} - Supprimer (ADMIN)
```

### **💬 Avis**
```
GET /api/reviews - Tous les avis
POST /api/reviews - Créer un avis
GET /api/reviews/artwork/{id} - Avis d'une œuvre
POST /api/reviews/{id}/approve - Approuver (ADMIN)
```

### **📧 Contact**
```
POST /api/contact - Envoyer un message
GET /api/contact - Tous les messages (ADMIN)
GET /api/contact/unread - Messages non lus (ADMIN)
```

### **📊 Statistiques**
```
GET /api/stats - Toutes les stats (ADMIN)
```

## 🧪 **TESTS**

### **1. Créer l'admin**
```bash
curl -X POST http://localhost:8091/api/auth/create-admin
```

### **2. Se connecter**
```bash
curl -X POST http://localhost:8091/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@artspark.com","password":"admin123"}'
```

### **3. Tester les œuvres**
```bash
curl http://localhost:8091/api/artworks
```

## 🔧 **CONFIGURATION**

### **Ports**
- **Backend :** 8091
- **Frontend :** 8081 (React)

### **CORS**
Configuré pour `http://localhost:8081` et `http://localhost:3000`

### **JWT**
- Secret : `ArtSparkStudioCanvasSecretKey2024VerySecureAndLongEnoughForHS512Algorithm`
- Expiration : 24 heures

## 📁 **STRUCTURE**

```
src/
├── main/
│   ├── java/com/artspark/
│   │   ├── ArtsparkBackendApplication.java
│   │   ├── config/          # Configuration (CORS, JWT, Security)
│   │   ├── controller/      # Contrôleurs REST
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # Entités JPA
│   │   ├── repository/     # Repositories JPA
│   │   ├── service/        # Services métier
│   │   └── exception/      # Gestion des exceptions
│   └── resources/
│       ├── application.properties
│       └── schema.sql
└── test/
```

## 🐛 **DÉPANNAGE**

### **Erreur de connexion DB**
```bash
# Vérifier MySQL
mysql -u root -p
SHOW DATABASES;
USE artspark_db;
SHOW TABLES;
```

### **Erreur CORS**
```bash
# Vérifier les logs
# Chercher les erreurs CORS dans les logs
```

### **Port déjà utilisé**
```bash
# Vérifier les ports
netstat -ano | findstr :8091

# Changer le port dans application.properties
server.port=8092
```

## 📊 **BASE DE DONNÉES**

### **Tables**
- `users` - Utilisateurs (Admin/User)
- `artworks` - Œuvres d'art
- `reviews` - Avis et commentaires
- `contact_messages` - Messages de contact

### **Admin par défaut**
- **Email :** admin@artspark.com
- **Mot de passe :** admin123
- **Rôle :** ADMIN

## 🚀 **DÉPLOIEMENT**

### **Production**
```bash
# Build avec profil production
mvn clean package -Pprod

# Déployer
java -jar target/artspark-backend-1.0.0.jar --spring.profiles.active=prod
```

## 📝 **LOGS**

```bash
# Suivre les logs
tail -f logs/application.log

# Ou dans la console Maven
mvn spring-boot:run
```

## ✅ **CHECKLIST**

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
- [ ] Tests de connexion réussis
- [ ] Login fonctionnel
- [ ] API endpoints accessibles

## 📞 **SUPPORT**

Pour toute question ou problème, vérifiez :
1. Les logs de l'application
2. La configuration de la base de données
3. Les paramètres CORS
4. La configuration JWT

**Votre backend ArtSpark Studio Canvas est prêt !** 🎨✨
