import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useArtwork } from '@/contexts/ArtworkContext';
import { useToast } from '@/hooks/use-toast';

const FinalTest: React.FC = () => {
  const [formData, setFormData] = useState({
    title: 'Test Final',
    description: 'Test complet du flux d\'ajout d\'œuvre',
    category: 'Test',
    technique: 'Acrylique',
    size: '100x80 cm',
    year: '2024',
    available: true,
    featured: false,
    image: '/test-final.jpg',
    tags: 'test, final',
    materials: 'acrylique, toile'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addArtwork, artworks } = useArtwork();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🧪 [FinalTest] Starting complete flow test...');
      console.log('🧪 [FinalTest] Form data:', formData);
      
      // Créer l'objet artwork exactement comme dans AdminDashboard
      const artworkData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        technique: formData.technique,
        size: formData.size,
        year: formData.year,
        available: formData.available,
        featured: formData.featured,
        image: formData.image,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        materials: formData.materials.split(',').map(mat => mat.trim()).filter(Boolean),
      };

      console.log('🧪 [FinalTest] Artwork data:', artworkData);
      
      // Utiliser addArtwork exactement comme dans AdminDashboard
      await addArtwork(artworkData);
      
      console.log('🧪 [FinalTest] Success! Artwork added to backend');
      console.log('🧪 [FinalTest] Current artworks count:', artworks.length);
      
      toast({
        title: "Succès Complet !",
        description: "L'œuvre a été ajoutée à la base de données et s'affiche dans la galerie !",
      });
      
    } catch (error: any) {
      console.error('🧪 [FinalTest] Error:', error);
      
      toast({
        title: "Erreur",
        description: `Erreur: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-green-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-800">🎯 Test Final Complet</h2>
      <p className="text-green-600 mb-4">
        Ce test vérifie le flux complet : ajout → BDD → affichage galerie
      </p>
      
      <div className="mb-4 p-3 bg-white rounded border">
        <h3 className="font-semibold text-gray-800">État actuel :</h3>
        <p className="text-sm text-gray-600">
          Œuvres dans la galerie : <span className="font-bold">{artworks.length}</span>
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Catégorie *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="technique">Technique</Label>
          <Input
            id="technique"
            value={formData.technique}
            onChange={(e) => setFormData({...formData, technique: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="size">Dimensions</Label>
          <Input
            id="size"
            value={formData.size}
            onChange={(e) => setFormData({...formData, size: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="year">Année</Label>
          <Input
            id="year"
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="image">URL Image</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700" 
          disabled={isLoading}
        >
          {isLoading ? 'Test en cours...' : '🎯 Tester le Flux Complet'}
        </Button>
      </form>
    </div>
  );
};

export default FinalTest;
