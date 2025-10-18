package com.artspark.service;

import com.artspark.entity.ContactMessage;
import com.artspark.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ContactService {
    
    @Autowired
    private ContactMessageRepository contactMessageRepository;
    
    // Créer un nouveau message de contact
    public ContactMessage createMessage(ContactMessage message) {
        return contactMessageRepository.save(message);
    }
    
    // Trouver tous les messages
    public List<ContactMessage> findAll() {
        return contactMessageRepository.findRecentMessages();
    }
    
    // Trouver un message par ID
    public Optional<ContactMessage> findById(Long id) {
        return contactMessageRepository.findById(id);
    }
    
    // Trouver tous les messages non lus
    public List<ContactMessage> findUnreadMessages() {
        return contactMessageRepository.findByIsReadFalse();
    }
    
    // Trouver tous les messages non répondu
    public List<ContactMessage> findUnrespondedMessages() {
        return contactMessageRepository.findByIsRespondedFalse();
    }
    
    // Marquer un message comme lu
    public ContactMessage markAsRead(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message non trouvé"));
        
        message.setIsRead(true);
        return contactMessageRepository.save(message);
    }
    
    // Marquer un message comme répondu
    public ContactMessage markAsResponded(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message non trouvé"));
        
        message.setIsResponded(true);
        return contactMessageRepository.save(message);
    }
    
    // Supprimer un message
    public void deleteMessage(Long id) {
        if (!contactMessageRepository.existsById(id)) {
            throw new RuntimeException("Message non trouvé");
        }
        contactMessageRepository.deleteById(id);
    }
    
    // Rechercher des messages
    public List<ContactMessage> searchMessages(String search) {
        return contactMessageRepository.findBySearchTerm(search);
    }
    
    // Trouver les messages par email
    public List<ContactMessage> findByEmail(String email) {
        return contactMessageRepository.findByEmail(email);
    }
    
    // Compter les messages non lus
    public long countUnreadMessages() {
        return contactMessageRepository.countByIsReadFalse();
    }
    
    // Compter les messages non répondu
    public long countUnrespondedMessages() {
        return contactMessageRepository.countByIsRespondedFalse();
    }
    
    // Trouver les messages les plus anciens non lus
    public List<ContactMessage> findOldestUnreadMessages() {
        return contactMessageRepository.findOldestUnreadMessages();
    }
    
    // Obtenir les statistiques des messages
    public List<Object[]> getMessageStatistics() {
        return contactMessageRepository.countByReadStatus();
    }
}
