import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useArtwork } from '@/contexts/ArtworkContext';
import { useToast } from '@/hooks/use-toast';

const TestRealFlow: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    technique: '',
    size: '',
    year: '2024',
    available: true,
    featured: false,
    image: '',
    tags: '',
    materials: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addArtwork } = useArtwork();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🧪 [TestRealFlow] Form data:', formData);
      
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
        image: formData.image || '/placeholder.svg',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        materials: formData.materials.split(',').map(mat => mat.trim()).filter(Boolean),
      };

      console.log('🧪 [TestRealFlow] Artwork data:', artworkData);
      
      // Utiliser addArtwork exactement comme dans AdminDashboard
      await addArtwork(artworkData);
      
      console.log('🧪 [TestRealFlow] Success!');
      
      toast({
        title: "Succès",
        description: "Œuvre ajoutée avec succès !",
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        technique: '',
        size: '',
        year: '2024',
        available: true,
        featured: false,
        image: '',
        tags: '',
        materials: ''
      });
      
    } catch (error: any) {
      console.error('🧪 [TestRealFlow] Error:', error);
      
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🧪 Test Flux Réel</h2>
      <p className="text-gray-600 mb-4">
        Ce test utilise exactement le même flux que le formulaire principal.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Titre de l'œuvre"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Description de l'œuvre"
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Catégorie *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            placeholder="ex: Peinture"
            required
          />
        </div>

        <div>
          <Label htmlFor="technique">Technique</Label>
          <Input
            id="technique"
            value={formData.technique}
            onChange={(e) => setFormData({...formData, technique: e.target.value})}
            placeholder="ex: Acrylique sur toile"
          />
        </div>

        <div>
          <Label htmlFor="size">Dimensions</Label>
          <Input
            id="size"
            value={formData.size}
            onChange={(e) => setFormData({...formData, size: e.target.value})}
            placeholder="ex: 100x80 cm"
          />
        </div>

        <div>
          <Label htmlFor="year">Année</Label>
          <Input
            id="year"
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: e.target.value})}
            placeholder="2024"
          />
        </div>

        <div>
          <Label htmlFor="image">URL Image</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
            placeholder="/test.jpg"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Ajout en cours...' : 'Ajouter l\'œuvre'}
        </Button>
      </form>
    </div>
  );
};

export default TestRealFlow;
