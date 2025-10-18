import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Eye, Upload, X, Image as ImageIcon, Camera, Grid3X3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useArtwork } from '@/contexts/ArtworkContext';

interface ArtworkImage {
  id: number;
  artwork_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface Artwork {
  id: string;
  title: string;
  category: string;
  image_url: string;
  images?: ArtworkImage[];
  size: string;
  year: number;
  available: boolean;
  description: string;
  featured: boolean;
  tags: string[];
  materials: string[];
  technique?: string;
  artist_name?: string;
  price_mad?: string;
  price_eur?: string;
  reference?: string;
  support?: string;
  medium?: string;
  dimensions?: string;
  story?: string;
  views: number;
  created_at: string;
  updated_at: string;
}

const AdminDashboard: React.FC = () => {
  const { artworks, addArtwork, updateArtwork, deleteArtwork, clearAllArtworks, resetAllViews, refreshArtworks } = useArtwork();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    technique: '',
    size: '',
    year: new Date().getFullYear(),
    available: true,
    featured: false,
    tags: '',
    materials: '',
    image_url: ''
  });

  const categories = ['Abstrait', 'Portrait', 'Paysage', 'Photographie', 'Sculpture', 'Mixte'];
  const techniques = ['Peinture acrylique', 'Peinture à l\'huile', 'Peinture mixte', 'Photographie artistique', 'Sculpture', 'Dessin', 'Aquarelle'];

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      technique: '',
      size: '',
      year: new Date().getFullYear(),
      available: true,
      featured: false,
      tags: '',
      materials: '',
      image_url: ''
    });
    setPreviewImages([]);
    setIsAdding(false);
    setEditingId(null);
  };

  // Multiple image upload handler
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validate all files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erreur",
          description: `Le fichier ${file.name} n'est pas une image valide (PNG, JPG, JPEG)`,
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: `L'image ${file.name} fait ${(file.size / (1024 * 1024)).toFixed(1)}MB. Veuillez choisir une image de moins de 50MB.`,
          variant: "destructive",
        });
        return;
      }
    }

    setIsUploading(true);
    
    try {
      const newImages: string[] = [];
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          newImages.push(base64);
          
          // If this is the last file, update state
          if (newImages.length === files.length) {
            setPreviewImages(prev => [...prev, ...newImages]);
            setIsUploading(false);
            
            toast({
              title: "Succès",
              description: `${files.length} image(s) téléchargée(s) avec succès`,
              variant: "success",
            });
          }
        };
        
        reader.onerror = () => {
          setIsUploading(false);
          toast({
            title: "Erreur",
            description: `Erreur lors du téléchargement de ${file.name}`,
            variant: "destructive",
          });
        };
        
        reader.readAsDataURL(file);
      }
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement des images",
        variant: "destructive",
      });
    }
  };

  // Remove uploaded image
  const removeImage = (index?: number) => {
    if (index !== undefined) {
      // Remove specific image
      setPreviewImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove all images
      setPreviewImages([]);
      setFormData(prev => ({ ...prev, image_url: '' }));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent multiple submissions
    
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires (Titre, Description, Catégorie)",
        variant: "destructive",
      });
      return;
    }

    // Check if images are required but not provided
    if (previewImages.length === 0 && (!formData.image_url || formData.image_url === '')) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins une image",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Use preview images if available, otherwise fall back to image_url
    const imagesToSave = previewImages.length > 0 ? previewImages : (formData.image_url ? [formData.image_url] : []);

    const artworkData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      technique: formData.technique,
      size: formData.size,
      year: formData.year,
      available: formData.available,
      featured: formData.featured,
      image_url: imagesToSave[0] || '', // First image as primary
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      materials: formData.materials.split(',').map(mat => mat.trim()).filter(Boolean),
    };

    try {
      console.log('🎨 [AdminDashboard] Submitting artwork:', artworkData);
      if (editingId) {
        await updateArtwork(editingId, artworkData, imagesToSave);
        toast({
          title: "Succès",
          description: "Œuvre mise à jour avec succès",
          variant: "success",
        });
      } else {
        await addArtwork(artworkData, imagesToSave);
        toast({
          title: "Succès",
          description: "Nouvelle œuvre ajoutée avec succès",
          variant: "success",
        });
        // Force refresh artworks list
        await refreshArtworks();
        console.log('Artwork added successfully, artworks refreshed');
      }
      resetForm();
    } catch (error: any) {
      console.error('Error saving artwork:', error);
      
      // If we get here, it's a real error (not localStorage fallback)
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de l'œuvre. Vérifiez votre connexion.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (artwork: Artwork) => {
    setFormData({
      title: artwork.title,
      description: artwork.description,
      category: artwork.category,
      technique: artwork.technique || '',
      size: artwork.size,
      year: artwork.year,
      available: artwork.available,
      featured: artwork.featured || false,
      tags: artwork.tags?.join(', ') || '',
      materials: artwork.materials?.join(', ') || '',
      image_url: artwork.image_url
    });
    
    // Load existing images
    if (artwork.images && artwork.images.length > 0) {
      setPreviewImages(artwork.images.map(img => img.image_url));
    } else {
      setPreviewImages(artwork.image_url ? [artwork.image_url] : []);
    }
    
    setEditingId(artwork.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette œuvre ?')) {
      try {
        await deleteArtwork(id);
        toast({
          title: "Succès",
          description: "Œuvre supprimée avec succès",
          variant: "success",
        });
      } catch (error: any) {
        console.error('Delete error:', error);
        
        // Provide more specific error messages
        let errorMessage = "Erreur lors de la suppression de l'œuvre";
        
        if (error.message) {
          if (error.message.includes('404') || error.message.includes('not found')) {
            errorMessage = "L'œuvre n'a pas été trouvée";
          } else if (error.message.includes('403') || error.message.includes('Access denied')) {
            errorMessage = "Accès refusé - Privilèges administrateur requis";
          } else if (error.message.includes('401') || error.message.includes('Authentication')) {
            errorMessage = "Authentification requise - Veuillez vous reconnecter";
          } else if (error.message.includes('Failed to delete')) {
            errorMessage = "Impossible de supprimer l'œuvre - Vérifiez votre connexion";
          } else {
            errorMessage = error.message;
          }
        }
        
        toast({
          title: "Erreur de suppression",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  const clearAllData = async () => {
    if (window.confirm('⚠️ ATTENTION: Ceci va supprimer TOUTES les œuvres de la galerie (base de données + données locales). Êtes-vous sûr ?')) {
      try {
        await clearAllArtworks();
        
        toast({
          title: "Galerie vidée",
          description: "Toutes les œuvres ont été supprimées de la galerie.",
          variant: "success",
        });
        
        // Reload the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error('Error clearing artworks:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression des œuvres.",
          variant: "destructive",
        });
      }
    }
  };

  const resetViews = async () => {
    if (window.confirm('⚠️ ATTENTION: Ceci va remettre à zéro TOUS les compteurs de vues. Êtes-vous sûr ?')) {
      try {
        await resetAllViews();
        
        toast({
          title: "Compteurs réinitialisés",
          description: "Tous les compteurs de vues ont été remis à zéro.",
          variant: "success",
        });
        
        // Clear session storage to allow new views
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('artwork_viewed_')) {
            sessionStorage.removeItem(key);
          }
        });
        
        console.log('Session storage cleared for view tracking');
      } catch (error) {
        console.error('Error resetting views:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la réinitialisation des vues.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-orange-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-white/20">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                  🎨 Tableau de Bord Admin
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">
                  Gestion complète des œuvres d'art et du contenu de la galerie
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  onClick={resetViews}
                  variant="outline"
                  size="sm"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Reset Vues
                </Button>
                <Button
                  onClick={clearAllData}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Effacer tout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-700">Total Œuvres</CardTitle>
              <Eye className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-slate-800">{artworks.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-700">Disponibles</CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">✓</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-slate-800">
                {artworks.filter(a => a.available).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-700">Total Vues</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-slate-800">
                {artworks.reduce((total, artwork) => total + (artwork.views || 0), 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-700">En Vedette</CardTitle>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">⭐</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-slate-800">
                {artworks.filter(a => a.featured).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-700">Catégories</CardTitle>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{new Set(artworks.map(a => a.category)).size}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-slate-800">
                {new Set(artworks.map(a => a.category)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <Card className="mb-6 sm:mb-8 bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                {editingId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {editingId ? 'Modifier l\'œuvre' : 'Ajouter une nouvelle œuvre'}
              </CardTitle>
              <CardDescription className="text-slate-600">
                Remplissez les détails de l'œuvre d'art
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Nom de l'œuvre"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Technique */}
                  <div className="space-y-2">
                    <Label htmlFor="technique">Technique</Label>
                    <Select value={formData.technique} onValueChange={(value) => setFormData({...formData, technique: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une technique" />
                      </SelectTrigger>
                      <SelectContent>
                        {techniques.map(tech => (
                          <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Size */}
                  <div className="space-y-2">
                    <Label htmlFor="size">Dimensions</Label>
                    <Input
                      id="size"
                      value={formData.size}
                      onChange={(e) => setFormData({...formData, size: e.target.value})}
                      placeholder="ex: 80x60 cm"
                    />
                  </div>

                  {/* Year */}
                  <div className="space-y-2">
                    <Label htmlFor="year">Année</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: parseInt(e.target.value) || new Date().getFullYear()})}
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>

                  {/* Image URL */}
                  <div className="space-y-2">
                    <Label htmlFor="image">URL de l'image</Label>
                    <Input
                      id="image"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      placeholder="/artwork1.JPG"
                    />
                  </div>
                </div>

                {/* Multiple Image Upload Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold text-slate-700">📸 Images de l'œuvre</Label>
                    <div className="text-xs text-slate-500 bg-blue-50 px-2 py-1 rounded">
                      💡 Astuce: Vous pouvez uploader plusieurs images (jusqu'à 50MB chacune)
                    </div>
                  </div>
                  
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                    <div className="text-center">
                      {previewImages.length > 0 ? (
                        <div className="space-y-4">
                          {/* Image Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {previewImages.map((image, index) => (
                              <div key={index} className="relative group">
                                <img 
                                  src={image} 
                                  alt={`Preview ${index + 1}`} 
                                  className="w-full h-32 object-cover rounded-lg shadow-md"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-2 -right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                  {index + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Add More Images Button */}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="mx-auto"
                          >
                            {isUploading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                                Téléchargement...
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-2" />
                                Ajouter plus d'images
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Grid3X3 className="h-8 w-8 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-600 mb-2">
                              Glissez-déposez des images ou cliquez pour sélectionner plusieurs fichiers
                            </p>
                            <p className="text-xs text-slate-500">
                              PNG, JPG, JPEG jusqu'à 50MB chacun
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="mx-auto"
                          >
                            {isUploading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                                Téléchargement...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Choisir des images
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Description détaillée de l'œuvre..."
                    rows={4}
                    required
                  />
                </div>

                {/* Tags and Materials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="Séparés par des virgules"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="materials">Matériaux</Label>
                    <Input
                      id="materials"
                      value={formData.materials}
                      onChange={(e) => setFormData({...formData, materials: e.target.value})}
                      placeholder="Séparés par des virgules"
                    />
                  </div>
                </div>

                {/* Switches */}
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={formData.available}
                      onCheckedChange={(checked) => setFormData({...formData, available: checked})}
                    />
                    <Label htmlFor="available">Disponible</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                    />
                    <Label htmlFor="featured">En vedette</Label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3"
                    disabled={isUploading || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Ajout en cours...
                      </>
                    ) : isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Traitement...
                      </>
                    ) : (
                      <>
                        {editingId ? 'Mettre à jour' : 'Ajouter l\'œuvre'}
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                    className="flex-1 sm:flex-none border-slate-300 hover:bg-slate-50"
                    disabled={isUploading}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Add Button */}
        {!isAdding && (
          <div className="mb-6 flex gap-4">
            <Button 
              onClick={() => setIsAdding(true)} 
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une nouvelle œuvre
            </Button>
          </div>
        )}


        {/* Artworks List */}
        <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-yellow-50 rounded-t-lg">
            <CardTitle className="text-slate-800 flex items-center gap-2">
              <Grid3X3 className="h-5 w-5" />
              Gestion des Œuvres
            </CardTitle>
            <CardDescription className="text-slate-600">
              Liste de toutes les œuvres d'art avec options de gestion
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {artworks.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Eye className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucune œuvre d'art trouvée</h3>
                <p className="text-sm text-slate-500 mb-4">Commencez par ajouter votre première œuvre</p>
                        <Button 
                          onClick={() => setIsAdding(true)}
                          className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                        >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une œuvre
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {artworks.map((artwork) => (
                  <Card key={artwork.id} className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                    <div className="aspect-square bg-slate-100 relative group">
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      
                      {artwork.featured && (
                        <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                          ⭐ Vedette
                        </Badge>
                      )}
                      {!artwork.available && (
                        <Badge variant="destructive" className="absolute top-2 left-2 shadow-lg">
                          Indisponible
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-1">{artwork.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 mb-3 line-clamp-2">
                        {artwork.description}
                      </p>
                      
                      <div className="space-y-1 text-xs text-slate-500 mb-4">
                        <div className="flex justify-between">
                          <span className="font-medium">Catégorie:</span>
                          <span>{artwork.category}</span>
                        </div>
                        {artwork.technique && (
                          <div className="flex justify-between">
                            <span className="font-medium">Technique:</span>
                            <span className="truncate ml-2">{artwork.technique}</span>
                          </div>
                        )}
                        {artwork.size && (
                          <div className="flex justify-between">
                            <span className="font-medium">Taille:</span>
                            <span>{artwork.size}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="font-medium">Année:</span>
                          <span>{artwork.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Vues:</span>
                          <span className="font-semibold text-blue-600">{artwork.views || 0}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(artwork)}
                                  className="flex-1 text-xs sm:text-sm border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">Modifier</span>
                          <span className="sm:hidden">Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(artwork.id)}
                          className="px-2 sm:px-3"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
