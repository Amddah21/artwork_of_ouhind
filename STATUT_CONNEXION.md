# 🚀 TEST DE CONNEXION FRONTEND-BACKEND

## 📋 **STATUT ACTUEL**

### ✅ **Frontend (React)**
- **Port :** 8080 (démarré)
- **URL :** http://localhost:8080
- **Configuration :** ✅ Corrigée pour port 8091
- **Processus :** Node.js actif

### ❌ **Backend (Spring Boot)**
- **Port :** 8091 (non accessible)
- **Processus :** Java en cours mais port fermé
- **Erreur :** Compilation corrigée mais démarrage échoué

## 🔧 **PROBLÈME IDENTIFIÉ**

Le backend Spring Boot ne démarre pas correctement. Voici les étapes pour résoudre :

### **1. Vérifier les logs d'erreur**
```bash
# Aller dans le dossier backend
cd artspark-backend

# Démarrer en mode synchrone pour voir les erreurs
mvn spring-boot:run
```

### **2. Alternative : Utiliser H2 Database**
```bash
# Modifier application.properties pour utiliser H2
# Remplacer la configuration MySQL par H2
```

### **3. Test rapide avec H2**
```bash
# Configuration H2 dans application.properties :
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
```

## 🧪 **TESTS DE CONNEXION**

### **Test Frontend**
```javascript
// Ouvrir http://localhost:8080 dans le navigateur
// Console (F12) :

// Test de connexion
fetch('http://localhost:8091/api/artworks')
  .then(response => response.json())
  .then(data => console.log('✅ Connexion réussie:', data))
  .catch(error => console.error('❌ Erreur:', error));
```

### **Test Backend (quand démarré)**
```bash
# Créer l'admin
Invoke-RestMethod -Uri "http://localhost:8091/api/auth/create-admin" -Method POST

# Se connecter
$loginBody = '{"email":"admin@artspark.com","password":"admin123"}'
Invoke-RestMethod -Uri "http://localhost:8091/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody

# Tester les œuvres
Invoke-RestMethod -Uri "http://localhost:8091/api/artworks"
```

## 🔄 **PROCHAINES ÉTAPES**

1. **Démarrer le backend** avec H2 Database
2. **Vérifier les logs** pour identifier l'erreur
3. **Tester la connexion** une fois démarré
4. **Connecter le frontend** au backend

## ⚠️ **NOTES IMPORTANTES**

- **Frontend :** ✅ Prêt et configuré
- **Backend :** ❌ Nécessite correction du démarrage
- **CORS :** ✅ Configuré pour port 8080
- **Base de données :** H2 recommandée pour test rapide

**Le frontend est prêt ! Il faut maintenant résoudre le problème de démarrage du backend.** 🔧
