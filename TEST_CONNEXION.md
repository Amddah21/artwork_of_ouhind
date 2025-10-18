# 🔗 TEST DE CONNEXION FRONTEND-BACKEND

## 📋 **STATUT ACTUEL**

### **Frontend (React)**
- ✅ **Port :** 8081 (probablement démarré)
- ✅ **Processus Node.js :** Actif
- ✅ **Configuration API :** `src/lib/api.ts` pointe vers `http://localhost:8091`

### **Backend (Spring Boot)**
- ❌ **Port :** 8091 (non démarré)
- ❌ **MySQL :** Non installé/configuré
- ❌ **Processus Java :** Inactif

## 🚀 **ÉTAPES POUR CONNECTER FRONTEND-BACKEND**

### **1. Installer MySQL (si nécessaire)**
```bash
# Option 1: Télécharger depuis https://dev.mysql.com/downloads/mysql/
# Option 2: Utiliser XAMPP/WAMP qui inclut MySQL
# Option 3: Utiliser Docker
docker run --name mysql-artspark -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=artspark_db -p 3306:3306 -d mysql:8.0
```

### **2. Configurer la base de données**
```sql
-- Se connecter à MySQL
mysql -u root -p

-- Créer la base de données
CREATE DATABASE artspark_db;
USE artspark_db;

-- Exécuter le script SQL
SOURCE artspark-backend/src/main/resources/schema.sql;

-- Vérifier les tables
SHOW TABLES;
```

### **3. Démarrer le backend**
```bash
# Aller dans le dossier backend
cd artspark-backend

# Compiler et démarrer
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

## 🧪 **TESTS DE CONNEXION**

### **Test 1: Vérifier les ports**
```bash
# Frontend
netstat -ano | findstr :8081

# Backend
netstat -ano | findstr :8091
```

### **Test 2: Test CORS depuis le navigateur**
```javascript
// Ouvrir la console du navigateur sur http://localhost:8081
fetch('http://localhost:8091/api/artworks', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include'
})
.then(response => response.json())
.then(data => console.log('✅ Connexion réussie:', data))
.catch(error => console.error('❌ Erreur de connexion:', error));
```

### **Test 3: Test de login depuis le frontend**
```javascript
// Dans la console du navigateur
fetch('http://localhost:8091/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@artspark.com',
    password: 'admin123'
  })
})
.then(response => response.json())
.then(data => console.log('✅ Login réussi:', data))
.catch(error => console.error('❌ Erreur de login:', error));
```

## 🔧 **CONFIGURATION FRONTEND**

Vérifiez que votre `src/lib/api.ts` est configuré correctement :

```typescript
const API_BASE_URL = 'http://localhost:8091/api';
```

## 🐛 **DÉPANNAGE**

### **Erreur CORS**
```bash
# Vérifier que le backend est démarré
curl http://localhost:8091/api/artworks

# Vérifier les logs du backend pour les erreurs CORS
```

### **Erreur de connexion à la base de données**
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
netstat -ano | findstr :8081

# Changer le port dans application.properties si nécessaire
server.port=8092
```

## ✅ **CHECKLIST DE CONNEXION**

- [ ] MySQL installé et démarré
- [ ] Base de données `artspark_db` créée
- [ ] Tables créées avec `schema.sql`
- [ ] Backend Spring Boot démarré sur port 8091
- [ ] Frontend React démarré sur port 8081
- [ ] Test de création d'admin réussi
- [ ] Test de login réussi
- [ ] Test CORS réussi
- [ ] API endpoints accessibles depuis le frontend

## 🎯 **RÉSULTAT ATTENDU**

Une fois connectés, vous devriez pouvoir :
1. **Se connecter** depuis votre frontend React
2. **Récupérer les œuvres** depuis l'API
3. **Créer/modifier/supprimer** des œuvres (admin)
4. **Gérer les avis** et messages de contact
5. **Voir les statistiques** dans le dashboard

**Actuellement, seul le frontend est démarré. Le backend nécessite MySQL et doit être démarré pour établir la connexion.** 🔗
