# 🚀 DÉMARRAGE RAPIDE FRONTEND-BACKEND

## 📋 **STATUT ACTUEL**

### ✅ **Frontend (React)**
- **Port :** 8081 (démarré)
- **Configuration :** Corrigée pour port 8091
- **Processus :** Node.js actif

### ❌ **Backend (Spring Boot)**
- **Port :** 8091 (non démarré)
- **Base de données :** Non configurée
- **Processus :** Java inactif

## 🔧 **CORRECTIONS APPORTÉES**

1. ✅ **Frontend :** Port corrigé de 8090 → 8091
2. ✅ **Backend :** Ajout de H2 Database pour tests rapides
3. ✅ **Configuration :** Fichier application-test.properties créé

## 🚀 **DÉMARRAGE RAPIDE (SANS MYSQL)**

### **Option 1: Avec H2 Database (Recommandé pour test)**
```bash
# 1. Aller dans le dossier backend
cd artspark-backend

# 2. Remplacer temporairement la configuration
copy src\main\resources\application-test.properties src\main\resources\application.properties

# 3. Démarrer le backend
mvn spring-boot:run
```

### **Option 2: Avec MySQL (Production)**
```bash
# 1. Installer MySQL ou utiliser Docker
docker run --name mysql-artspark -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=artspark_db -p 3306:3306 -d mysql:8.0

# 2. Configurer la base de données
mysql -u root -p
CREATE DATABASE artspark_db;
USE artspark_db;
SOURCE src/main/resources/schema.sql;

# 3. Démarrer le backend
mvn spring-boot:run
```

## 🧪 **TESTS DE CONNEXION**

### **Test 1: Vérifier les ports**
```bash
# Frontend
netstat -ano | findstr :8081

# Backend (après démarrage)
netstat -ano | findstr :8091
```

### **Test 2: Test API Backend**
```bash
# Créer l'admin
curl -X POST http://localhost:8091/api/auth/create-admin

# Se connecter
curl -X POST http://localhost:8091/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@artspark.com","password":"admin123"}'

# Tester les œuvres
curl http://localhost:8091/api/artworks
```

### **Test 3: Test Frontend-Backend**
```javascript
// Ouvrir http://localhost:8081 dans le navigateur
// Ouvrir la console (F12) et exécuter :

// Test de connexion
fetch('http://localhost:8091/api/artworks')
  .then(response => response.json())
  .then(data => console.log('✅ Connexion réussie:', data))
  .catch(error => console.error('❌ Erreur:', error));

// Test de login
fetch('http://localhost:8091/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@artspark.com',
    password: 'admin123'
  })
})
.then(response => response.json())
.then(data => console.log('✅ Login réussi:', data))
.catch(error => console.error('❌ Erreur login:', error));
```

## 📊 **RÉSULTATS ATTENDUS**

### **Backend démarré avec H2 :**
```
Started ArtsparkBackendApplication in X.XXX seconds
H2 Console available at: http://localhost:8091/h2-console
```

### **Tests réussis :**
```json
// Création admin
{"message":"Admin créé avec succès","username":"admin","email":"admin@artspark.com"}

// Login
{"token":"eyJhbGciOiJIUzUxMiJ9...","type":"Bearer","username":"admin","email":"admin@artspark.com","role":"ADMIN"}

// Œuvres
[]
```

## 🔄 **PROCHAINES ÉTAPES**

1. **Démarrer le backend** avec H2 Database
2. **Tester la connexion** avec curl
3. **Tester depuis le frontend** dans le navigateur
4. **Vérifier le login** dans votre application React
5. **Tester les fonctionnalités** (créer œuvres, avis, etc.)

## ⚠️ **NOTES IMPORTANTES**

- **H2 Database** : Base de données en mémoire, données perdues au redémarrage
- **MySQL** : Base de données persistante, recommandée pour la production
- **CORS** : Configuré pour `http://localhost:8081`
- **JWT** : Token valide 24 heures

**Votre frontend est prêt ! Il ne reste plus qu'à démarrer le backend pour établir la connexion.** 🔗
