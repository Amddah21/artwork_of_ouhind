import { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ArtworkFormProps {
  artwork?: any;
  onClose: () => void;
}

const ArtworkForm = ({ artwork, onClose }: ArtworkFormProps) => {
  const { addArtwork, updateArtwork } = useAdmin();
  const { getCurrencySymbol } = useCurrency();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    price: '',
    originalPrice: '',
    size: '',
    year: '',
    available: true,
    description: '',
    featured: false,
    tags: [] as string[],
    materials: [] as string[],
    technique: '',
    offer: {
      type: 'percentage' as 'percentage' | 'fixed',
      value: '',
      startDate: '',
      endDate: '',
      active: false
    }
  });

  const [newTag, setNewTag] = useState('');
  const [newMaterial, setNewMaterial] = useState('');

  useEffect(() => {
    if (artwork) {
      setFormData({
        title: artwork.title || '',
        category: artwork.category || '',
        image: artwork.image || '',
        price: artwork.price?.toString() || '',
        originalPrice: artwork.originalPrice?.toString() || '',
        size: artwork.size || '',
        year: artwork.year || '',
        available: artwork.available ?? true,
        description: artwork.description || '',
        featured: artwork.featured ?? false,
        tags: artwork.tags || [],
        materials: artwork.materials || [],
        technique: artwork.technique || '',
        offer: {
          type: artwork.offer?.type || 'percentage',
          value: artwork.offer?.value?.toString() || '',
          startDate: artwork.offer?.startDate || '',
          endDate: artwork.offer?.endDate || '',
          active: artwork.offer?.active || false
        }
      });
    }
  }, [artwork]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const artworkData = {
      title: formData.title,
      category: formData.category,
      image: formData.image,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      size: formData.size,
      year: formData.year,
      available: formData.available,
      description: formData.description,
      featured: formData.featured,
      tags: formData.tags,
      materials: formData.materials,
      technique: formData.technique,
      offer: formData.offer.active ? {
        type: formData.offer.type,
        value: parseFloat(formData.offer.value),
        startDate: formData.offer.startDate || undefined,
        endDate: formData.offer.endDate || undefined,
        active: true
      } : undefined
    };

    if (artwork) {
      updateArtwork(artwork.id, artworkData);
    } else {
      addArtwork(artworkData);
    }
    
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addMaterial = () => {
    if (newMaterial.trim() && !formData.materials.includes(newMaterial.trim())) {
      setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, newMaterial.trim()]
      }));
      setNewMaterial('');
    }
  };

  const removeMaterial = (materialToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter(material => material !== materialToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-background shadow-xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {artwork ? 'Modifier l\'Œuvre' : 'Ajouter une Œuvre'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de Base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aquarelle">Aquarelle</SelectItem>
                      <SelectItem value="Dessin au Crayon">Dessin au Crayon</SelectItem>
                      <SelectItem value="Fusain">Fusain</SelectItem>
                      <SelectItem value="Techniques Mixtes">Techniques Mixtes</SelectItem>
                      <SelectItem value="Illustration">Illustration</SelectItem>
                      <SelectItem value="Encre">Encre</SelectItem>
                      <SelectItem value="Peinture à l'Huile">Peinture à l'Huile</SelectItem>
                      <SelectItem value="Acrylique">Acrylique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="image">URL de l'Image *</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Prix et Offres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Prix ({getCurrencySymbol()}) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Prix Original ({getCurrencySymbol()})</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="offer-active"
                    checked={formData.offer.active}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      offer: { ...prev.offer, active: checked }
                    }))}
                  />
                  <Label htmlFor="offer-active">Activer une offre</Label>
                </div>

                {formData.offer.active && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="offer-type">Type d'Offre</Label>
                        <Select
                          value={formData.offer.type}
                          onValueChange={(value: 'percentage' | 'fixed') => setFormData(prev => ({
                            ...prev,
                            offer: { ...prev.offer, type: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Pourcentage</SelectItem>
                            <SelectItem value="fixed">Montant Fixe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="offer-value">
                          Valeur ({formData.offer.type === 'percentage' ? '%' : getCurrencySymbol()})
                        </Label>
                        <Input
                          id="offer-value"
                          type="number"
                          value={formData.offer.value}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            offer: { ...prev.offer, value: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="offer-start">Date de Début</Label>
                        <Input
                          id="offer-start"
                          type="date"
                          value={formData.offer.startDate}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            offer: { ...prev.offer, startDate: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="offer-end">Date de Fin</Label>
                        <Input
                          id="offer-end"
                          type="date"
                          value={formData.offer.endDate}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            offer: { ...prev.offer, endDate: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>Détails Techniques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="size">Dimensions *</Label>
                    <Input
                      id="size"
                      value={formData.size}
                      onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                      placeholder="40x60 cm"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Année *</Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                      placeholder="2023"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="technique">Technique</Label>
                  <Input
                    id="technique"
                    value={formData.technique}
                    onChange={(e) => setFormData(prev => ({ ...prev, technique: e.target.value }))}
                    placeholder="Aquarelle sur papier"
                  />
                </div>

                {/* Tags */}
                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Ajouter un tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-sm rounded"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Materials */}
                <div>
                  <Label>Matériaux</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newMaterial}
                      onChange={(e) => setNewMaterial(e.target.value)}
                      placeholder="Ajouter un matériau"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
                    />
                    <Button type="button" onClick={addMaterial} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.materials.map((material, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground text-sm rounded"
                      >
                        {material}
                        <button
                          type="button"
                          onClick={() => removeMaterial(material)}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Statut</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: checked }))}
                  />
                  <Label htmlFor="available">Disponible à la vente</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured">Mettre en vedette</Label>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" className="flex-1">
                {artwork ? 'Mettre à jour' : 'Ajouter l\'Œuvre'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtworkForm;
