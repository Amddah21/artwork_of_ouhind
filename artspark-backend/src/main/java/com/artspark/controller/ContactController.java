package com.artspark.controller;

import com.artspark.entity.ContactMessage;
import com.artspark.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:8081", "http://localhost:3000"})
public class ContactController {

    @Autowired
    private ContactService contactService;

    // Routes publiques
    @PostMapping
    public ResponseEntity<Map<String, String>> sendMessage(@RequestBody ContactMessage message) {
        try {
            ContactMessage savedMessage = contactService.createMessage(message);
            return ResponseEntity.ok(Map.of("message", "Message envoyé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Erreur lors de l'envoi du message"));
        }
    }

    // Routes protégées (ADMIN)
    @GetMapping
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        List<ContactMessage> messages = contactService.findAll();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<ContactMessage>> getUnreadMessages() {
        List<ContactMessage> unreadMessages = contactService.findUnreadMessages();
        return ResponseEntity.ok(unreadMessages);
    }

    @PostMapping("/{contactId}/read")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable Long contactId) {
        try {
            contactService.markAsRead(contactId);
            return ResponseEntity.ok(Map.of("message", "Message marqué comme lu"));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{contactId}/responded")
    public ResponseEntity<Map<String, String>> markAsResponded(@PathVariable Long contactId) {
        try {
            contactService.markAsResponded(contactId);
            return ResponseEntity.ok(Map.of("message", "Message marqué comme répondu"));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{contactId}")
    public ResponseEntity<Map<String, String>> deleteMessage(@PathVariable Long contactId) {
        try {
            contactService.deleteMessage(contactId);
            return ResponseEntity.ok(Map.of("message", "Message supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<ContactMessage>> searchMessages(@RequestParam String q) {
        List<ContactMessage> messages = contactService.searchMessages(q);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getContactStats() {
        Map<String, Object> stats = Map.of(
            "totalMessages", contactService.findAll().size(),
            "unreadMessages", contactService.countUnreadMessages(),
            "unrespondedMessages", contactService.countUnrespondedMessages()
        );
        return ResponseEntity.ok(stats);
    }
}
