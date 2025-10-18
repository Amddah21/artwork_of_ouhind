# 🚀 GUIDE RAPIDE SUPABASE - RÉSOLUTION IMMÉDIATE

## ❌ PROBLÈME ACTUEL
Vos œuvres sont stockées dans `localStorage` (spécifique à chaque navigateur/appareil)
- ✅ Visibles sur `localhost:8083`
- ❌ Pas visibles sur `192.168.100.156:8083`

## ✅ SOLUTION : CONFIGURER SUPABASE

### ÉTAPE 1 : Obtenir vos clés Supabase
1. Allez sur https://supabase.com
2. Connectez-vous à votre compte
3. Ouvrez votre projet
4. Cliquez sur **Settings** (Paramètres) dans le menu de gauche
5. Cliquez sur **API**
6. Copiez :
   - **Project URL** (ex: `https://abcdefgh.supabase.co`)
   - **anon public** key (ex: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### ÉTAPE 2 : Mettre à jour le fichier .env
Remplacez dans le fichier `.env` :
```
VITE_SUPABASE_URL=https://VOTRE-PROJET-ID.supabase.co
VITE_SUPABASE_ANON_KEY=VOTRE-CLE-ANON-PUBLIQUE
```

### ÉTAPE 3 : Redémarrer le serveur
```bash
npm run dev
```

### ÉTAPE 4 : Tester
1. Allez sur votre dashboard admin
2. Cliquez sur le bouton **"Test Supabase"** (bleu)
3. Il devrait dire "✅ Supabase connecté !"

## 🎯 RÉSULTAT ATTENDU
Après configuration :
- ✅ Œuvres visibles sur `localhost:8083`
- ✅ Œuvres visibles sur `192.168.100.156:8083`
- ✅ Œuvres visibles sur tous les appareils

## 🔧 SI VOUS N'AVEZ PAS DE PROJET SUPABASE
1. Allez sur https://supabase.com
2. Cliquez sur "New Project"
3. Créez un projet gratuit
4. Suivez les étapes ci-dessus
