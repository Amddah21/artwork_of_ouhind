# 🚀 SCRIPT DE DÉMARRAGE RAPIDE - ArtSpark Backend

## 📋 **ÉTAPES DE DÉMARRAGE**

### **1. Vérifier les prérequis**
```bash
# Vérifier Java
java -version

# Vérifier MySQL
mysql --version

# Vérifier Maven
mvn --version
```

### **2. Configurer MySQL**
```sql
-- Se connecter à MySQL
mysql -u root -p

-- Créer la base de données
CREATE DATABASE artspark_db;
USE artspark_db;

-- Exécuter le script SQL
SOURCE src/main/resources/schema.sql;

-- Vérifier les tables
SHOW TABLES;

-- Vérifier l'admin
SELECT * FROM users;
```

### **3. Démarrer le backend**
```bash
# Aller dans le dossier backend
cd artspark-backend

# Compiler le projet
mvn clean compile

# Démarrer l'application
mvn spring-boot:run
```

### **4. Tester la connexion**
```bash
# Test de création d'admin
curl -X POST http://localhost:8091/api/auth/create-admin

# Test de login
curl -X POST http://localhost:8091/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@artspark.com","password":"admin123"}'

# Test des œuvres
curl http://localhost:8091/api/artworks
```

### **5. Vérifier les logs**
```bash
# Dans la console Maven, vous devriez voir :
# ✅ Admin créé avec succès
# 🔐 Tentative de connexion pour: admin@artspark.com
# ✅ Token généré pour: admin@artspark.com
```

## 🎯 **URLS IMPORTANTES**

- **Backend :** http://localhost:8091
- **API Base :** http://localhost:8091/api
- **Login :** http://localhost:8091/api/auth/login
- **Œuvres :** http://localhost:8091/api/artworks
- **Statistiques :** http://localhost:8091/api/stats

## 🔧 **CONFIGURATION**

### **Ports**
- Backend : 8091
- Frontend : 8081 (React)

### **CORS**
Configuré pour `http://localhost:8081`

### **Admin par défaut**
- Email : admin@artspark.com
- Mot de passe : admin123

## 🐛 **DÉPANNAGE**

### **Erreur de connexion DB**
```bash
# Vérifier MySQL
mysql -u root -p
SHOW DATABASES;
USE artspark_db;
SHOW TABLES;
```

### **Port déjà utilisé**
```bash
# Vérifier les ports
netstat -ano | findstr :8091

# Changer le port dans application.properties
server.port=8092
```

### **Erreur CORS**
```bash
# Vérifier que le frontend est sur le bon port
# http://localhost:8081 (pas 3000)
```

## ✅ **CHECKLIST**

- [ ] Java 17+ installé
- [ ] MySQL 8.0+ installé et démarré
- [ ] Maven 3.6+ installé
- [ ] Base de données `artspark_db` créée
- [ ] Tables créées avec `schema.sql`
- [ ] Admin par défaut créé
- [ ] Backend démarré sur port 8091
- [ ] Tests de connexion réussis
- [ ] Login fonctionnel

**Votre backend ArtSpark Studio Canvas est prêt !** 🚀
