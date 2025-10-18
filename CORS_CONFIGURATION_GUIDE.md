# 🔧 CONFIGURATION CORS POUR SPRING BOOT

## 🚨 PROBLÈME IDENTIFIÉ
L'erreur "Failed to fetch" indique généralement un problème de CORS (Cross-Origin Resource Sharing).

## ✅ SOLUTION CORS COMPLÈTE

### 1. **Configuration CORS dans Spring Boot**

Ajoutez cette configuration dans votre classe principale Spring Boot :

```java
@SpringBootApplication
public class PortfolioApplication {
    public static void main(String[] args) {
        SpringApplication.run(PortfolioApplication.class, args);
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Autoriser les origines frontend
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:8081", 
            "http://localhost:5173",
            "http://127.0.0.1:8081",
            "http://127.0.0.1:3000"
        ));
        
        // Autoriser les méthodes HTTP
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"
        ));
        
        // Autoriser les headers
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // Autoriser les credentials
        configuration.setAllowCredentials(true);
        
        // Exposer les headers de réponse
        configuration.setExposedHeaders(Arrays.asList(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials"
        ));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
```

### 2. **Configuration CORS Globale**

Ou utilisez cette configuration globale :

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### 3. **Configuration CORS par Contrôleur**

Ou ajoutez l'annotation sur chaque contrôleur :

```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:8081",
    "http://localhost:5173"
}, allowCredentials = "true")
public class ArtworkController {
    // Votre code...
}
```

## 🔍 **DIAGNOSTIC CORS**

### **Test CORS avec curl :**

```bash
# Test OPTIONS (preflight)
curl -X OPTIONS http://localhost:8091/api/artworks \
  -H "Origin: http://localhost:8081" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -v

# Test POST avec CORS
curl -X POST http://localhost:8091/api/artworks \
  -H "Origin: http://localhost:8081" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"titre":"Test CORS","description":"Test","technique":"Test","dimensions":"100x100","annee":2024,"imageUrl":"/test.jpg"}' \
  -v
```

### **Headers CORS attendus :**

```
Access-Control-Allow-Origin: http://localhost:8081
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

## 🛠️ **SOLUTIONS ALTERNATIVES**

### **1. Configuration application.properties :**

```properties
# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:3000,http://localhost:8081,http://localhost:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

### **2. Configuration avec Spring Security :**

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/artworks").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // Configuration CORS comme ci-dessus
    }
}
```

## 🎯 **VÉRIFICATION**

Après avoir appliqué la configuration CORS :

1. **Redémarrez votre backend Spring Boot**
2. **Testez avec le composant NetworkTest**
3. **Vérifiez les headers dans la console du navigateur**

## 🚨 **ERREURS COURANTES**

- **"Access to fetch at 'http://localhost:8091/api/artworks' from origin 'http://localhost:8081' has been blocked by CORS policy"**
  → Solution : Ajouter l'origine dans allowedOrigins

- **"Response to preflight request doesn't pass access control check"**
  → Solution : Configurer OPTIONS method et headers

- **"The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'"**
  → Solution : Spécifier les origines exactes au lieu de '*'

## 📝 **CHECKLIST CORS**

- [ ] Backend redémarré
- [ ] Origines frontend ajoutées
- [ ] Méthodes HTTP autorisées
- [ ] Headers autorisés
- [ ] Credentials autorisés
- [ ] Test OPTIONS fonctionne
- [ ] Test POST fonctionne
- [ ] Headers CORS présents dans la réponse

**Une fois la configuration CORS appliquée, l'erreur "Failed to fetch" devrait être résolue !** 🚀
