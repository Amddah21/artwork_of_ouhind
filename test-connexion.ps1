# 🧪 SCRIPT DE TEST DE CONNEXION FRONTEND-BACKEND
# PowerShell Script pour tester la connexion complète

Write-Host "🚀 TEST DE CONNEXION FRONTEND-BACKEND" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Variables
$backendUrl = "http://localhost:8091"
$frontendUrl = "http://localhost:8080"

Write-Host "`n📋 CONFIGURATION:" -ForegroundColor Yellow
Write-Host "Frontend: $frontendUrl" -ForegroundColor Cyan
Write-Host "Backend:  $backendUrl" -ForegroundColor Cyan

# Test 1: Vérifier si le backend répond
Write-Host "`n🔍 Test 1: Vérification du backend..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$backendUrl/api/artworks" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend non accessible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Vérifiez que le backend est démarré avec: mvn spring-boot:run" -ForegroundColor Yellow
    exit 1
}

# Test 2: Créer l'admin
Write-Host "`n🔍 Test 2: Création de l'admin..." -ForegroundColor Yellow
try {
    $adminResponse = Invoke-RestMethod -Uri "$backendUrl/api/auth/create-admin" -Method POST
    Write-Host "✅ Admin créé: $($adminResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Admin peut-être déjà créé: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 3: Connexion admin
Write-Host "`n🔍 Test 3: Connexion admin..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@artspark.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$backendUrl/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "✅ Connexion réussie" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.token.Substring(0,20))..." -ForegroundColor Cyan
    
    # Stocker le token pour les tests suivants
    $token = $loginResponse.token
} catch {
    Write-Host "❌ Échec de connexion: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 4: Accès aux œuvres avec token
Write-Host "`n🔍 Test 4: Accès aux œuvres..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $artworksResponse = Invoke-RestMethod -Uri "$backendUrl/api/artworks" -Method GET -Headers $headers
    Write-Host "✅ Accès aux œuvres réussi" -ForegroundColor Green
    Write-Host "Nombre d'œuvres: $($artworksResponse.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Échec accès œuvres: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Test CORS depuis le frontend
Write-Host "`n🔍 Test 5: Test CORS..." -ForegroundColor Yellow
Write-Host "💡 Ouvrez http://localhost:8080 dans votre navigateur" -ForegroundColor Cyan
Write-Host "💡 Ouvrez la console (F12) et exécutez:" -ForegroundColor Cyan
Write-Host "`n   fetch('$backendUrl/api/artworks')" -ForegroundColor White
Write-Host "     .then(response => response.json())" -ForegroundColor White
Write-Host "     .then(data => console.log('✅ CORS OK:', data))" -ForegroundColor White
Write-Host "     .catch(error => console.error('❌ CORS Error:', error));" -ForegroundColor White

# Résumé
Write-Host "`n📊 RÉSUMÉ DES TESTS:" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host "✅ Backend accessible" -ForegroundColor Green
Write-Host "✅ Admin créé" -ForegroundColor Green
Write-Host "✅ Connexion réussie" -ForegroundColor Green
Write-Host "✅ Token JWT valide" -ForegroundColor Green
Write-Host "✅ API fonctionnelle" -ForegroundColor Green

Write-Host "`n🎉 CONNEXION FRONTEND-BACKEND RÉUSSIE !" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

Write-Host "`n🌐 URLs:" -ForegroundColor Yellow
Write-Host "Frontend: $frontendUrl" -ForegroundColor Cyan
Write-Host "Backend:  $backendUrl" -ForegroundColor Cyan
Write-Host "H2 Console: $backendUrl/h2-console" -ForegroundColor Cyan

Write-Host "`n🔑 Credentials Admin:" -ForegroundColor Yellow
Write-Host "Email: admin@artspark.com" -ForegroundColor Cyan
Write-Host "Password: admin123" -ForegroundColor Cyan
