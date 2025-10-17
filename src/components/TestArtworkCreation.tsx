import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { SpringArtworkService } from '@/services/spring-artwork-service';
import { useToast } from '@/hooks/use-toast';

const TestArtworkCreation: React.FC = () => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    technique: '',
    dimensions: '',
    annee: 2024,
    imageUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🧪 [Test] Submitting artwork data:', formData);
      
      const result = await SpringArtworkService.createArtwork(formData);
      console.log('🧪 [Test] Artwork created successfully:', result);
      
      toast({
        title: "Succès",
        description: "Œuvre créée avec succès !",
      });
      
      // Reset form
      setFormData({
        titre: '',
        description: '',
        technique: '',
        dimensions: '',
        annee: 2024,
        imageUrl: ''
      });
      
    } catch (error: any) {
      console.error('🧪 [Test] Error creating artwork:', error);
      
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
      <h2 className="text-2xl font-bold mb-4">Test Création Œuvre</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="titre">Titre *</Label>
          <Input
            id="titre"
            value={formData.titre}
            onChange={(e) => setFormData({...formData, titre: e.target.value})}
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
          <Label htmlFor="technique">Technique</Label>
          <Input
            id="technique"
            value={formData.technique}
            onChange={(e) => setFormData({...formData, technique: e.target.value})}
            placeholder="ex: Acrylique sur toile"
          />
        </div>

        <div>
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input
            id="dimensions"
            value={formData.dimensions}
            onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
            placeholder="ex: 100x80 cm"
          />
        </div>

        <div>
          <Label htmlFor="annee">Année</Label>
          <Input
            id="annee"
            type="number"
            value={formData.annee}
            onChange={(e) => setFormData({...formData, annee: parseInt(e.target.value)})}
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        <div>
          <Label htmlFor="imageUrl">URL Image</Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            placeholder="/test.jpg"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Création...' : 'Créer l\'œuvre'}
        </Button>
      </form>
    </div>
  );
};

export default TestArtworkCreation;
