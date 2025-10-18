package com.artspark.repository;

import com.artspark.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    
    // Trouver tous les messages non lus
    List<ContactMessage> findByIsReadFalse();
    
    // Trouver tous les messages non répondu
    List<ContactMessage> findByIsRespondedFalse();
    
    // Trouver tous les messages lus
    List<ContactMessage> findByIsReadTrue();
    
    // Trouver tous les messages répondu
    List<ContactMessage> findByIsRespondedTrue();
    
    // Trouver les messages par email
    List<ContactMessage> findByEmail(String email);
    
    // Trouver les messages par nom
    List<ContactMessage> findByNameContainingIgnoreCase(String name);
    
    // Rechercher des messages par contenu
    @Query("SELECT c FROM ContactMessage c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.subject) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.message) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<ContactMessage> findBySearchTerm(@Param("search") String search);
    
    // Trouver les messages récents
    @Query("SELECT c FROM ContactMessage c ORDER BY c.createdAt DESC")
    List<ContactMessage> findRecentMessages();
    
    // Trouver les messages par période
    @Query("SELECT c FROM ContactMessage c WHERE c.createdAt BETWEEN :startDate AND :endDate ORDER BY c.createdAt DESC")
    List<ContactMessage> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
    
    // Compter les messages non lus
    long countByIsReadFalse();
    
    // Compter les messages non répondu
    long countByIsRespondedFalse();
    
    // Compter les messages par statut
    @Query("SELECT c.isRead, COUNT(c) FROM ContactMessage c GROUP BY c.isRead")
    List<Object[]> countByReadStatus();
    
    // Trouver les messages les plus anciens non lus
    @Query("SELECT c FROM ContactMessage c WHERE c.isRead = false ORDER BY c.createdAt ASC")
    List<ContactMessage> findOldestUnreadMessages();
}
