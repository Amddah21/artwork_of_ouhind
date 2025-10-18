package com.artspark.repository;

import com.artspark.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Trouver un utilisateur par email
    Optional<User> findByEmail(String email);
    
    // Trouver un utilisateur par nom d'utilisateur
    Optional<User> findByUsername(String username);
    
    // Vérifier si un utilisateur existe par email
    boolean existsByEmail(String email);
    
    // Vérifier si un utilisateur existe par nom d'utilisateur
    boolean existsByUsername(String username);
    
    // Trouver tous les utilisateurs par rôle
    List<User> findByRole(User.Role role);
    
    // Trouver tous les administrateurs
    @Query("SELECT u FROM User u WHERE u.role = 'ADMIN'")
    List<User> findAllAdmins();
    
    // Compter le nombre d'utilisateurs par rôle
    long countByRole(User.Role role);
    
    // Rechercher des utilisateurs par nom ou email
    @Query("SELECT u FROM User u WHERE u.username LIKE %:search% OR u.email LIKE %:search%")
    List<User> findByUsernameOrEmailContaining(@Param("search") String search);
}
