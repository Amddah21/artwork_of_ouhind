package com.artspark.service;

import com.artspark.entity.User;
import com.artspark.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé: " + email));
    }
    
    // Créer un nouvel utilisateur
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Un nom d'utilisateur existe déjà");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    
    // Trouver un utilisateur par email
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    // Trouver un utilisateur par ID
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    // Trouver tous les utilisateurs
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    // Trouver tous les administrateurs
    public List<User> findAllAdmins() {
        return userRepository.findAllAdmins();
    }
    
    // Mettre à jour un utilisateur
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        user.setRole(userDetails.getRole());
        
        return userRepository.save(user);
    }
    
    // Supprimer un utilisateur
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Utilisateur non trouvé");
        }
        userRepository.deleteById(id);
    }
    
    // Vérifier les credentials
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
    
    // Encoder un mot de passe
    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }
    
    // Créer un admin par défaut
    public User createDefaultAdmin() {
        if (userRepository.existsByEmail("admin@artspark.com")) {
            return userRepository.findByEmail("admin@artspark.com").orElse(null);
        }
        
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@artspark.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(User.Role.ADMIN);
        
        return userRepository.save(admin);
    }
    
    // Compter les utilisateurs par rôle
    public long countByRole(User.Role role) {
        return userRepository.countByRole(role);
    }
    
    // Rechercher des utilisateurs
    public List<User> searchUsers(String search) {
        return userRepository.findByUsernameOrEmailContaining(search);
    }
}
