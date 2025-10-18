# SUPABASE CONFIGURATION GUIDE
# =============================

# Pour que vos œuvres soient visibles sur tous les appareils,
# vous devez configurer Supabase avec vos vraies clés.

# ÉTAPES À SUIVRE :

# 1. Créez un fichier .env à la racine de votre projet avec ce contenu :
# VITE_SUPABASE_URL=https://votre-projet-id.supabase.co
# VITE_SUPABASE_ANON_KEY=votre-cle-anon-publique

# 2. Obtenez vos clés Supabase :
#    - Allez sur https://supabase.com
#    - Ouvrez votre projet
#    - Allez dans Settings > API
#    - Copiez votre Project URL et votre anon public key

# 3. Remplacez les valeurs dans le fichier .env par vos vraies clés

# 4. Redémarrez votre serveur de développement :
#    npm run dev

# PROBLÈME ACTUEL :
# Vos œuvres sont stockées dans localStorage (local à votre PC)
# Elles ne sont pas visibles sur d'autres appareils

# SOLUTION :
# Une fois Supabase configuré, vos œuvres seront stockées dans la base de données
# et seront visibles sur tous les appareils
