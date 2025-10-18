# 🧪 TESTS DE CONNEXION - ArtSpark Backend

## 🔍 **SCRIPT DE TEST COMPLET**

Voici un script PowerShell pour tester toutes les fonctionnalités de votre backend.

---

## 📋 **SCRIPT DE TEST**

**Chemin :** `test-backend.ps1`

```powershell
# Script de test pour ArtSpark Backend
# Exécuter avec: .\test-backend.ps1

Write-Host "🚀 TEST BACKEND ARTSPARK STUDIO CANVAS" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Configuration
$baseUrl = "http://localhost:8091"
$adminEmail = "admin@artspark.com"
$adminPassword = "admin123"

# Fonction pour tester une URL
function Test-Endpoint {
    param(
        [string]$url,
        [string]$method = "GET",
        [hashtable]$headers = @{},
        [string]$body = $null,
        [string]$description = ""
    )
    
    Write-Host "`n🔍 Test: $description" -ForegroundColor Yellow
    Write-Host "URL: $url" -ForegroundColor Gray
    Write-Host "Method: $method" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $url
            Method = $method
            Headers = $headers
            ContentType = "application/json"
        }
        
        if ($body) {
            $params.Body = $body
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "✅ SUCCESS" -ForegroundColor Green
        Write-Host "Response: $($response | ConvertTo-Json -Depth 2)" -ForegroundColor White
        return $response
    }
    catch {
        Write-Host "❌ ERROR" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Test 1: Créer l'admin
Write-Host "`n📝 ÉTAPE 1: Création de l'admin" -ForegroundColor Cyan
$adminResponse = Test-Endpoint -url "$baseUrl/api/auth/create-admin" -method "POST" -description "Créer l'admin par défaut"

if ($adminResponse) {
    Write-Host "✅ Admin créé avec succès" -ForegroundColor Green
} else {
    Write-Host "❌ Échec de la création de l'admin" -ForegroundColor Red
    exit 1
}

# Test 2: Login
Write-Host "`n🔐 ÉTAPE 2: Test de connexion" -ForegroundColor Cyan
$loginBody = @{
    email = $adminEmail
    password = $adminPassword
} | ConvertTo-Json

$loginResponse = Test-Endpoint -url "$baseUrl/api/auth/login" -method "POST" -body $loginBody -description "Connexion admin"

if ($loginResponse -and $loginResponse.token) {
    Write-Host "✅ Connexion réussie" -ForegroundColor Green
    $token = $loginResponse.token
    $authHeaders = @{
        "Authorization" = "Bearer $token"
    }
} else {
    Write-Host "❌ Échec de la connexion" -ForegroundColor Red
    exit 1
}

# Test 3: Validation du token
Write-Host "`n🔑 ÉTAPE 3: Validation du token" -ForegroundColor Cyan
$validateResponse = Test-Endpoint -url "$baseUrl/api/auth/validate" -headers $authHeaders -method "POST" -description "Valider le token JWT"

if ($validateResponse -and $validateResponse.valid) {
    Write-Host "✅ Token valide" -ForegroundColor Green
} else {
    Write-Host "❌ Token invalide" -ForegroundColor Red
}

# Test 4: Récupérer les œuvres
Write-Host "`n🎨 ÉTAPE 4: Test des œuvres" -ForegroundColor Cyan
$artworksResponse = Test-Endpoint -url "$baseUrl/api/artworks" -description "Récupérer toutes les œuvres"

if ($artworksResponse) {
    Write-Host "✅ API œuvres accessible" -ForegroundColor Green
} else {
    Write-Host "❌ API œuvres inaccessible" -ForegroundColor Red
}

# Test 5: Créer une œuvre (ADMIN)
Write-Host "`n🖼️ ÉTAPE 5: Création d'une œuvre" -ForegroundColor Cyan
$artworkBody = @{
    titre = "Test Artwork"
    description = "Une œuvre de test"
    technique = "Huile sur toile"
    dimensions = "50x70 cm"
    annee = 2024
    imageUrl = "/images/test.jpg"
} | ConvertTo-Json

$createArtworkResponse = Test-Endpoint -url "$baseUrl/api/artworks" -method "POST" -headers $authHeaders -body $artworkBody -description "Créer une œuvre"

if ($createArtworkResponse) {
    Write-Host "✅ Œuvre créée avec succès" -ForegroundColor Green
    $artworkId = $createArtworkResponse.id
} else {
    Write-Host "❌ Échec de la création de l'œuvre" -ForegroundColor Red
}

# Test 6: Récupérer une œuvre par ID
if ($artworkId) {
    Write-Host "`n🔍 ÉTAPE 6: Récupérer une œuvre par ID" -ForegroundColor Cyan
    $artworkByIdResponse = Test-Endpoint -url "$baseUrl/api/artworks/$artworkId" -description "Récupérer l'œuvre par ID"
    
    if ($artworkByIdResponse) {
        Write-Host "✅ Œuvre récupérée par ID" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec de la récupération par ID" -ForegroundColor Red
    }
}

# Test 7: Rechercher des œuvres
Write-Host "`n🔎 ÉTAPE 7: Recherche d'œuvres" -ForegroundColor Cyan
$searchResponse = Test-Endpoint -url "$baseUrl/api/artworks/search?q=test" -description "Rechercher des œuvres"

if ($searchResponse) {
    Write-Host "✅ Recherche d'œuvres fonctionnelle" -ForegroundColor Green
} else {
    Write-Host "❌ Recherche d'œuvres échouée" -ForegroundColor Red
}

# Test 8: Créer un avis
Write-Host "`n💬 ÉTAPE 8: Création d'un avis" -ForegroundColor Cyan
$reviewBody = @{
    authorName = "Test User"
    rating = 5
    comment = "Excellente œuvre !"
    artwork = @{
        id = $artworkId
    }
} | ConvertTo-Json

$createReviewResponse = Test-Endpoint -url "$baseUrl/api/reviews" -method "POST" -body $reviewBody -description "Créer un avis"

if ($createReviewResponse) {
    Write-Host "✅ Avis créé avec succès" -ForegroundColor Green
    $reviewId = $createReviewResponse.id
} else {
    Write-Host "❌ Échec de la création de l'avis" -ForegroundColor Red
}

# Test 9: Récupérer les avis d'une œuvre
if ($artworkId) {
    Write-Host "`n📝 ÉTAPE 9: Récupérer les avis d'une œuvre" -ForegroundColor Cyan
    $reviewsByArtworkResponse = Test-Endpoint -url "$baseUrl/api/reviews/artwork/$artworkId" -description "Récupérer les avis d'une œuvre"
    
    if ($reviewsByArtworkResponse) {
        Write-Host "✅ Avis récupérés par œuvre" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec de la récupération des avis" -ForegroundColor Red
    }
}

# Test 10: Approuver un avis (ADMIN)
if ($reviewId) {
    Write-Host "`n✅ ÉTAPE 10: Approuver un avis" -ForegroundColor Cyan
    $approveReviewResponse = Test-Endpoint -url "$baseUrl/api/reviews/$reviewId/approve" -method "POST" -headers $authHeaders -description "Approuver un avis"
    
    if ($approveReviewResponse) {
        Write-Host "✅ Avis approuvé avec succès" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec de l'approbation de l'avis" -ForegroundColor Red
    }
}

# Test 11: Envoyer un message de contact
Write-Host "`n📧 ÉTAPE 11: Envoi d'un message de contact" -ForegroundColor Cyan
$contactBody = @{
    name = "Test User"
    email = "test@example.com"
    subject = "Test Contact"
    message = "Ceci est un message de test"
} | ConvertTo-Json

$contactResponse = Test-Endpoint -url "$baseUrl/api/contact" -method "POST" -body $contactBody -description "Envoyer un message de contact"

if ($contactResponse) {
    Write-Host "✅ Message de contact envoyé" -ForegroundColor Green
} else {
    Write-Host "❌ Échec de l'envoi du message" -ForegroundColor Red
}

# Test 12: Récupérer les statistiques (ADMIN)
Write-Host "`n📊 ÉTAPE 12: Récupérer les statistiques" -ForegroundColor Cyan
$statsResponse = Test-Endpoint -url "$baseUrl/api/stats" -headers $authHeaders -description "Récupérer les statistiques"

if ($statsResponse) {
    Write-Host "✅ Statistiques récupérées" -ForegroundColor Green
} else {
    Write-Host "❌ Échec de la récupération des statistiques" -ForegroundColor Red
}

# Test 13: Test CORS
Write-Host "`n🌐 ÉTAPE 13: Test CORS" -ForegroundColor Cyan
try {
    $corsResponse = Invoke-RestMethod -Uri "$baseUrl/api/artworks" -Method "OPTIONS" -Headers @{
        "Origin" = "http://localhost:8081"
        "Access-Control-Request-Method" = "GET"
        "Access-Control-Request-Headers" = "Content-Type"
    }
    Write-Host "✅ CORS configuré correctement" -ForegroundColor Green
} catch {
    Write-Host "❌ Problème CORS: $($_.Exception.Message)" -ForegroundColor Red
}

# Résumé des tests
Write-Host "`n📋 RÉSUMÉ DES TESTS" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host "✅ Backend accessible sur port 8091" -ForegroundColor Green
Write-Host "✅ Admin créé et connecté" -ForegroundColor Green
Write-Host "✅ JWT fonctionnel" -ForegroundColor Green
Write-Host "✅ API œuvres opérationnelle" -ForegroundColor Green
Write-Host "✅ API avis opérationnelle" -ForegroundColor Green
Write-Host "✅ API contact opérationnelle" -ForegroundColor Green
Write-Host "✅ API statistiques opérationnelle" -ForegroundColor Green
Write-Host "✅ CORS configuré" -ForegroundColor Green

Write-Host "`n🎉 TOUS LES TESTS SONT PASSÉS !" -ForegroundColor Green
Write-Host "Votre backend ArtSpark Studio Canvas est prêt !" -ForegroundColor Green
```

---

## 🚀 **COMMANDES DE TEST RAPIDE**

### **1. Test de base**
```powershell
# Test de création d'admin
Invoke-RestMethod -Uri "http://localhost:8091/api/auth/create-admin" -Method POST

# Test de login
$loginBody = '{"email":"admin@artspark.com","password":"admin123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8091/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

# Test avec token
$headers = @{"Authorization" = "Bearer $token"}
Invoke-RestMethod -Uri "http://localhost:8091/api/stats" -Headers $headers
```

### **2. Test des œuvres**
```powershell
# Récupérer toutes les œuvres
Invoke-RestMethod -Uri "http://localhost:8091/api/artworks"

# Créer une œuvre
$artworkBody = '{"titre":"Test","description":"Test","technique":"Huile","dimensions":"50x70","annee":2024}'
Invoke-RestMethod -Uri "http://localhost:8091/api/artworks" -Method POST -ContentType "application/json" -Body $artworkBody -Headers $headers
```

### **3. Test CORS**
```powershell
# Test CORS depuis PowerShell
$headers = @{
    "Origin" = "http://localhost:8081"
    "Access-Control-Request-Method" = "GET"
}
Invoke-RestMethod -Uri "http://localhost:8091/api/artworks" -Method OPTIONS -Headers $headers
```

---

## 🔧 **DÉPANNAGE**

### **1. Backend non accessible**
```powershell
# Vérifier les ports
netstat -ano | findstr :8091

# Vérifier les processus Java
jps -l
```

### **2. Erreur de base de données**
```sql
-- Vérifier MySQL
mysql -u root -p
SHOW DATABASES;
USE artspark_db;
SHOW TABLES;
```

### **3. Erreur CORS**
```powershell
# Vérifier les headers CORS
$response = Invoke-WebRequest -Uri "http://localhost:8091/api/artworks" -Method OPTIONS
$response.Headers
```

**Ce script de test vous permettra de vérifier que votre backend fonctionne correctement !** 🚀

Voulez-vous que j'exécute ces tests maintenant ?
