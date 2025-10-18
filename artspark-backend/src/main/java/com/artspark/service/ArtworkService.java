package com.artspark.service;

import com.artspark.entity.Artwork;
import com.artspark.repository.ArtworkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ArtworkService {
    
    @Autowired
    private ArtworkRepository artworkRepository;
    
    private final String uploadDir = "uploads/artworks/";
    
    // Créer une nouvelle œuvre
    public Artwork createArtwork(Artwork artwork) {
        return artworkRepository.save(artwork);
    }
    
    // Trouver toutes les œuvres
    public List<Artwork> findAll() {
        return artworkRepository.findAll();
    }
    
    // Trouver une œuvre par ID
    public Optional<Artwork> findById(Long id) {
        return artworkRepository.findById(id);
    }
    
    // Mettre à jour une œuvre
    public Artwork updateArtwork(Long id, Artwork artworkDetails) {
        Artwork artwork = artworkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Œuvre non trouvée"));
        
        artwork.setTitre(artworkDetails.getTitre());
        artwork.setDescription(artworkDetails.getDescription());
        artwork.setTechnique(artworkDetails.getTechnique());
        artwork.setDimensions(artworkDetails.getDimensions());
        artwork.setAnnee(artworkDetails.getAnnee());
        artwork.setImageUrl(artworkDetails.getImageUrl());
        
        return artworkRepository.save(artwork);
    }
    
    // Supprimer une œuvre
    public void deleteArtwork(Long id) {
        if (!artworkRepository.existsById(id)) {
            throw new RuntimeException("Œuvre non trouvée");
        }
        artworkRepository.deleteById(id);
    }
    
    // Rechercher des œuvres
    public List<Artwork> searchArtworks(String search) {
        return artworkRepository.findBySearchTerm(search);
    }
    
    // Recherche avancée
    public List<Artwork> advancedSearch(String titre, String technique, Integer annee) {
        return artworkRepository.findByAdvancedSearch(titre, technique, annee);
    }
    
    // Trouver les œuvres récentes
    public List<Artwork> findRecentArtworks() {
        return artworkRepository.findRecentArtworks();
    }
    
    // Trouver les œuvres par technique
    public List<Artwork> findByTechnique(String technique) {
        return artworkRepository.findByTechniqueContainingIgnoreCase(technique);
    }
    
    // Trouver les œuvres par année
    public List<Artwork> findByAnnee(Integer annee) {
        return artworkRepository.findByAnnee(annee);
    }
    
    // Upload d'image
    public String uploadImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Fichier vide");
        }
        
        // Créer le dossier d'upload s'il n'existe pas
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Générer un nom de fichier unique
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = System.currentTimeMillis() + "_" + originalFilename;
        
        // Sauvegarder le fichier
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        return "/api/artworks/images/" + filename;
    }
    
    // Obtenir les statistiques des œuvres
    public List<Object[]> getArtworkStatistics() {
        return artworkRepository.countByTechnique();
    }
    
    // Obtenir les statistiques par année
    public List<Object[]> getYearlyStatistics() {
        return artworkRepository.countByAnnee();
    }
    
    // Pagination des œuvres
    public Page<Artwork> findAllPaginated(Pageable pageable) {
        return artworkRepository.findAll(pageable);
    }
}
