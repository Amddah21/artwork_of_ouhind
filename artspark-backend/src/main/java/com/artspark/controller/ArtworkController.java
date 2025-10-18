package com.artspark.controller;

import com.artspark.entity.Artwork;
import com.artspark.service.ArtworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/artworks")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:8081", "http://localhost:3000"})
public class ArtworkController {

    @Autowired
    private ArtworkService artworkService;

    // Routes publiques
    @GetMapping
    public ResponseEntity<List<Artwork>> getAllArtworks() {
        List<Artwork> artworks = artworkService.findAll();
        return ResponseEntity.ok(artworks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Artwork> getArtworkById(@PathVariable Long id) {
        return artworkService.findById(id)
                .map(artwork -> ResponseEntity.ok(artwork))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Artwork>> searchArtworks(@RequestParam(required = false) String q,
                                                       @RequestParam(required = false) String technique,
                                                       @RequestParam(required = false) Integer annee) {
        List<Artwork> artworks;
        
        if (q != null && !q.isEmpty()) {
            artworks = artworkService.searchArtworks(q);
        } else {
            artworks = artworkService.advancedSearch(null, technique, annee);
        }
        
        return ResponseEntity.ok(artworks);
    }

    @GetMapping("/images/{fileName}")
    public ResponseEntity<byte[]> getImage(@PathVariable String fileName) {
        try {
            // Logique pour servir les images
            // Pour l'instant, retourner une réponse vide
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Routes protégées (ADMIN)
    @PostMapping
    public ResponseEntity<Artwork> createArtwork(@RequestBody Artwork artwork) {
        try {
            Artwork createdArtwork = artworkService.createArtwork(artwork);
            return ResponseEntity.ok(createdArtwork);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Artwork> updateArtwork(@PathVariable Long id, @RequestBody Artwork artworkDetails) {
        try {
            Artwork updatedArtwork = artworkService.updateArtwork(id, artworkDetails);
            return ResponseEntity.ok(updatedArtwork);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteArtwork(@PathVariable Long id) {
        try {
            artworkService.deleteArtwork(id);
            return ResponseEntity.ok(Map.of("message", "Œuvre supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = artworkService.uploadImage(file);
            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Erreur lors de l'upload"));
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Artwork>> getRecentArtworks() {
        List<Artwork> recentArtworks = artworkService.findRecentArtworks();
        return ResponseEntity.ok(recentArtworks);
    }

    @GetMapping("/technique/{technique}")
    public ResponseEntity<List<Artwork>> getArtworksByTechnique(@PathVariable String technique) {
        List<Artwork> artworks = artworkService.findByTechnique(technique);
        return ResponseEntity.ok(artworks);
    }

    @GetMapping("/year/{annee}")
    public ResponseEntity<List<Artwork>> getArtworksByYear(@PathVariable Integer annee) {
        List<Artwork> artworks = artworkService.findByAnnee(annee);
        return ResponseEntity.ok(artworks);
    }
}
