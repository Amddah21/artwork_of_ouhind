import { useState, useEffect } from 'react';
import { Heart, Star, MessageCircle, Share2, Eye, Calendar, MapPin, User, Award, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FavoriteArtwork {
  id: string;
  title: string;
  image: string;
  artist: string;
  year: number;
  medium: string;
  dimensions: string;
  price: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  addedDate: string;
  category: string;
  description: string;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteArtwork[]>([
    {
      id: '1',
      title: 'Rêves d\'Orient',
      image: '/artwork-1.jpg',
      artist: 'Oum Hind F. Douirani',
      year: 2023,
      medium: 'Aquarelle sur papier',
      dimensions: '50 x 70 cm',
      price: '45 000 MAD',
      rating: 4.8,
      reviewCount: 24,
      tags: ['Impressionniste', 'Aquarelle', 'Rêves', 'Fluidité'],
      addedDate: '2024-01-15',
      category: 'Aquarelle',
      description: 'Une œuvre captivante qui explore les mystères de l\'Orient à travers des techniques d\'aquarelle innovantes.'
    },
    {
      id: '2',
      title: 'Harmonie des Couleurs',
      image: '/artwork-2.jpg',
      artist: 'Oum Hind F. Douirani',
      year: 2023,
      medium: 'Huile sur toile',
      dimensions: '80 x 100 cm',
      price: '65 000 MAD',
      rating: 4.9,
      reviewCount: 18,
      tags: ['Abstrait', 'Couleurs', 'Harmonie', 'Moderne'],
      addedDate: '2024-01-10',
      category: 'Peinture',
      description: 'Une exploration audacieuse de la couleur et de la forme dans un style contemporain unique.'
    },
    {
      id: '3',
      title: 'Émotions du Sud',
      image: '/artwork-3.jpg',
      artist: 'Oum Hind F. Douirani',
      year: 2022,
      medium: 'Technique mixte',
      dimensions: '60 x 80 cm',
      price: '38 000 MAD',
      rating: 4.7,
      reviewCount: 31,
      tags: ['Émotions', 'Sud', 'Culture', 'Tradition'],
      addedDate: '2024-01-05',
      category: 'Mixte',
      description: 'Une célébration des émotions et de la culture du Sud marocain à travers l\'art contemporain.'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const sortFavorites = (favorites: FavoriteArtwork[]) => {
    return [...favorites].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return parseFloat(a.price.replace(/[^\d]/g, '')) - parseFloat(b.price.replace(/[^\d]/g, ''));
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const filteredFavorites = favorites.filter(favorite => {
    if (filter === 'all') return true;
    return favorite.category.toLowerCase() === filter.toLowerCase();
  });

  const sortedFavorites = sortFavorites(filteredFavorites);

  const categories = ['all', 'Aquarelle', 'Peinture', 'Mixte'];
  const sortOptions = [
    { value: 'date', label: 'Date d\'ajout' },
    { value: 'rating', label: 'Note' },
    { value: 'price', label: 'Prix' },
    { value: 'title', label: 'Titre' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-cream via-cream-50 to-warm-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-burnt-gold mr-3" />
            <h1 className="text-4xl font-display text-deep-charcoal">Mes Favoris</h1>
          </div>
          <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
            Retrouvez ici toutes les œuvres qui ont captivé votre attention et méritent une place spéciale dans votre collection personnelle.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="deep-card text-center">
            <CardContent className="p-6">
              <Heart className="h-8 w-8 text-burnt-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-deep-charcoal">{favorites.length}</div>
              <div className="text-sm text-charcoal-600">Œuvres favorites</div>
            </CardContent>
          </Card>
          <Card className="deep-card text-center">
            <CardContent className="p-6">
              <Star className="h-8 w-8 text-burnt-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-deep-charcoal">
                {(favorites.reduce((acc, item) => acc + item.rating, 0) / favorites.length).toFixed(1)}
              </div>
              <div className="text-sm text-charcoal-600">Note moyenne</div>
            </CardContent>
          </Card>
          <Card className="deep-card text-center">
            <CardContent className="p-6">
              <Award className="h-8 w-8 text-burnt-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-deep-charcoal">
                {favorites.reduce((acc, item) => acc + parseFloat(item.price.replace(/[^\d]/g, '')), 0).toLocaleString()} MAD
              </div>
              <div className="text-sm text-charcoal-600">Valeur totale</div>
            </CardContent>
          </Card>
          <Card className="deep-card text-center">
            <CardContent className="p-6">
              <Calendar className="h-8 w-8 text-burnt-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-deep-charcoal">
                {new Set(favorites.map(item => item.category)).size}
              </div>
              <div className="text-sm text-charcoal-600">Catégories</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <Tabs value={filter} onValueChange={setFilter} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-4 md:w-auto">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="aquarelle">Aquarelle</TabsTrigger>
              <TabsTrigger value="peinture">Peinture</TabsTrigger>
              <TabsTrigger value="mixte">Mixte</TabsTrigger>
            </TabsList>
          </Tabs>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="deep-input w-full md:w-48"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                Trier par: {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Favorites Grid */}
        {sortedFavorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-charcoal-400 mx-auto mb-4" />
            <h3 className="text-xl font-display text-charcoal-600 mb-2">Aucun favori pour le moment</h3>
            <p className="text-charcoal-500 mb-6">Découvrez nos œuvres et ajoutez vos préférées à vos favoris</p>
            <Button className="deep-button">Découvrir les œuvres</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFavorites.map((artwork) => (
              <Card key={artwork.id} className="deep-card group hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img 
                    src={artwork.image} 
                    alt={artwork.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFavorite(artwork.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-burnt-gold/90 text-white">
                      {artwork.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-display text-deep-charcoal mb-1">{artwork.title}</h3>
                      <p className="text-sm text-charcoal-600">{artwork.artist}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-deep-charcoal">{artwork.price}</div>
                      <div className="text-xs text-charcoal-500">{artwork.year}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(artwork.rating) ? 'text-burnt-gold fill-current' : 'text-charcoal-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-charcoal-600">
                      {artwork.rating} ({artwork.reviewCount} avis)
                    </span>
                  </div>

                  <p className="text-sm text-charcoal-600 mb-4 line-clamp-2">
                    {artwork.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {artwork.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-charcoal-500 mb-4">
                    <span>{artwork.medium}</span>
                    <span>{artwork.dimensions}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button className="deep-button flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir détails
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-xs text-charcoal-400 mt-3 pt-3 border-t border-charcoal-200">
                    Ajouté le {new Date(artwork.addedDate).toLocaleDateString('fr-FR')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Share Section */}
        {favorites.length > 0 && (
          <div className="mt-16 text-center">
            <Card className="deep-card max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-xl font-display text-deep-charcoal mb-4">
                  Partagez vos favoris
                </h3>
                <p className="text-charcoal-600 mb-6">
                  Montrez votre collection personnelle à vos amis et votre famille
                </p>
                <div className="flex gap-4 justify-center">
                  <Button className="deep-button">
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager la collection
                  </Button>
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Recommander
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
