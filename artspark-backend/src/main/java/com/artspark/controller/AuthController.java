package com.artspark.controller;

import com.artspark.config.JwtConfig;
import com.artspark.dto.AuthResponse;
import com.artspark.dto.LoginRequest;
import com.artspark.entity.User;
import com.artspark.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:8081", "http://localhost:3000"})
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtConfig jwtConfig;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("🔐 Tentative de connexion pour: " + loginRequest.getEmail());
            
            // Vérifier les credentials
            User user = userService.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));
            
            if (!userService.checkPassword(loginRequest.getPassword(), user.getPassword())) {
                System.out.println("❌ Échec de connexion: mot de passe incorrect");
                return ResponseEntity.status(401).body(Map.of("error", "Email ou mot de passe incorrect"));
            }

            // Générer le token JWT
            String token = jwtConfig.generateToken(user.getEmail(), user.getRole().name());
            System.out.println("✅ Token généré pour: " + user.getEmail());

            // Créer la réponse
            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setType("Bearer");
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setRole(user.getRole().name());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la connexion: " + e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Email ou mot de passe incorrect"));
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.ok(Map.of("valid", false));
            }

            String token = authHeader.substring(7);
            String email = jwtConfig.getUsernameFromToken(token);
            
            if (jwtConfig.validateToken(token, email)) {
                return ResponseEntity.ok(Map.of("valid", true));
            } else {
                return ResponseEntity.ok(Map.of("valid", false));
            }

        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("valid", false));
        }
    }

    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin() {
        try {
            System.out.println("🔧 Tentative de création d'admin...");
            
            User admin = userService.createDefaultAdmin();
            System.out.println("✅ Admin créé avec succès");

            Map<String, String> response = new HashMap<>();
            response.put("message", "Admin créé avec succès");
            response.put("username", admin.getUsername());
            response.put("email", admin.getEmail());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la création de l'admin: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Erreur lors de la création de l'admin"));
        }
    }
}
