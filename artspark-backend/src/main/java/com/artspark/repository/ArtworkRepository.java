package com.artspark.repository;

import com.artspark.entity.Artwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    
    // Rechercher des œuvres par titre
    List<Artwork> findByTitreContainingIgnoreCase(String titre);
    
    // Rechercher des œuvres par technique
    List<Artwork> findByTechniqueContainingIgnoreCase(String technique);
    
    // Rechercher des œuvres par année
    List<Artwork> findByAnnee(Integer annee);
    
    // Rechercher des œuvres par année (range)
    List<Artwork> findByAnneeBetween(Integer anneeDebut, Integer anneeFin);
    
    // Recherche globale (titre, description, technique)
    @Query("SELECT a FROM Artwork a WHERE " +
           "LOWER(a.titre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.technique) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Artwork> findBySearchTerm(@Param("search") String search);
    
    // Recherche avancée avec filtres
    @Query("SELECT a FROM Artwork a WHERE " +
           "(:titre IS NULL OR LOWER(a.titre) LIKE LOWER(CONCAT('%', :titre, '%'))) AND " +
           "(:technique IS NULL OR LOWER(a.technique) LIKE LOWER(CONCAT('%', :technique, '%'))) AND " +
           "(:annee IS NULL OR a.annee = :annee)")
    List<Artwork> findByAdvancedSearch(@Param("titre") String titre, 
                                      @Param("technique") String technique, 
                                      @Param("annee") Integer annee);
    
    // Trouver les œuvres les plus récentes
    @Query("SELECT a FROM Artwork a ORDER BY a.createdAt DESC")
    List<Artwork> findRecentArtworks();
    
    // Trouver les œuvres par ordre alphabétique
    @Query("SELECT a FROM Artwork a ORDER BY a.titre ASC")
    List<Artwork> findAllOrderByTitre();
    
    // Compter le nombre d'œuvres par technique
    @Query("SELECT a.technique, COUNT(a) FROM Artwork a GROUP BY a.technique")
    List<Object[]> countByTechnique();
    
    // Compter le nombre d'œuvres par année
    @Query("SELECT a.annee, COUNT(a) FROM Artwork a GROUP BY a.annee ORDER BY a.annee DESC")
    List<Object[]> countByAnnee();
}
