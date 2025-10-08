import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, StarOff, Package, DollarSign, Users, TrendingUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useReview } from '@/contexts/ReviewContext';
import ArtworkForm from '../components/ArtworkForm';
import RatingDisplay from '../components/RatingDisplay';
import ProtectedImage from '../components/ProtectedImage';

const AdminDashboard = () => {
  const { state, deleteArtwork, toggleAvailability, toggleFeatured, resetAllToAvailable, resetAllToUnavailable } = useAdmin();
  const { formatPrice } = useCurrency();
  const { state: reviewState, getArtworkRating } = useReview();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<any>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'unavailable' | 'featured'>('all');

  const handleEdit = (artwork: any) => {
    setEditingArtwork(artwork);
    setShowForm(true);
  };

  const handleViewArtwork = (artwork: any) => {
    navigate(`/artwork/${artwork.id}`);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingArtwork(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette œuvre ?')) {
      deleteArtwork(id);
    }
  };

  const handleToggleAvailability = (id: number) => {
    toggleAvailability(id);
  };

  const clearStorageAndReset = () => {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données et réinitialiser ?')) {
      localStorage.removeItem('artworks');
      window.location.reload();
    }
  };

  const stats = {
    totalArtworks: state.artworks.length,
    availableArtworks: state.artworks.filter(a => a.available).length,
    featuredArtworks: state.artworks.filter(a => a.featured).length,
    totalValue: state.artworks.reduce((sum, a) => sum + a.price, 0),
    totalReviews: reviewState.reviews.length,
    averageRating: reviewState.reviews.length > 0 
      ? reviewState.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewState.reviews.length 
      : 0
  };

  // Filter artworks based on selected filter
  const getFilteredArtworks = () => {
    switch (filterStatus) {
      case 'available':
        return state.artworks.filter(a => a.available);
      case 'unavailable':
        return state.artworks.filter(a => !a.available);
      case 'featured':
        return state.artworks.filter(a => a.featured);
      default:
        return state.artworks;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tableau de Bord Admin</h1>
              <p className="text-primary-foreground/80 mt-2">
                Gérez votre galerie d'art et vos œuvres
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <Button
                onClick={() => setShowForm(true)}
                className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden xs:inline">Ajouter une Œuvre</span>
                <span className="xs:hidden">Ajouter</span>
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={resetAllToAvailable}
                  variant="outline"
                  className="bg-green-600 text-white hover:bg-green-700 flex-1 sm:flex-none"
                  size="sm"
                >
                  <span className="hidden xs:inline">Tout Afficher</span>
                  <span className="xs:hidden">Afficher</span>
                </Button>
                <Button
                  onClick={resetAllToUnavailable}
                  variant="outline"
                  className="bg-gray-600 text-white hover:bg-gray-700 flex-1 sm:flex-none"
                  size="sm"
                >
                  <span className="hidden xs:inline">Tout Masquer</span>
                  <span className="xs:hidden">Masquer</span>
                </Button>
                <Button
                  onClick={clearStorageAndReset}
                  variant="outline"
                  className="bg-red-600 text-white hover:bg-red-700 flex-1 sm:flex-none"
                  size="sm"
                >
                  <span className="hidden xs:inline">Réinitialiser</span>
                  <span className="xs:hidden">Reset</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Œuvres</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalArtworks}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableArtworks}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Vedette</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.featuredArtworks}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalValue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Avis</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)} ⭐</div>
            </CardContent>
          </Card>
        </div>

        {/* Artworks Management */}
        <Card>
          <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Gestion des Œuvres</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Gérez vos œuvres d'art, prix, offres et descriptions
                  </CardDescription>
                </div>
                <div className="flex gap-2 self-start sm:self-auto">
                  <Button
                    variant={view === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setView('grid')}
                    className="flex-1 sm:flex-none"
                  >
                    <span className="hidden xs:inline">Grille</span>
                    <span className="xs:hidden">📱</span>
                  </Button>
                  <Button
                    variant={view === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setView('list')}
                    className="flex-1 sm:flex-none"
                  >
                    <span className="hidden xs:inline">Liste</span>
                    <span className="xs:hidden">📋</span>
                  </Button>
                </div>
              </div>
          </CardHeader>
          <CardContent>
            {/* Filter Options */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                Tous ({state.artworks.length})
              </Button>
              <Button
                variant={filterStatus === 'available' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('available')}
              >
                Disponibles ({stats.availableArtworks})
              </Button>
              <Button
                variant={filterStatus === 'unavailable' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('unavailable')}
              >
                Indisponibles ({state.artworks.length - stats.availableArtworks})
              </Button>
              <Button
                variant={filterStatus === 'featured' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('featured')}
              >
                En Vedette ({stats.featuredArtworks})
              </Button>
            </div>
            {view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {getFilteredArtworks().map((artwork) => (
                  <Card key={artwork.id} className="overflow-hidden">
                    <div 
                      className="aspect-square overflow-hidden cursor-pointer"
                      onClick={() => handleViewArtwork(artwork)}
                    >
                      <ProtectedImage
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        showWatermark={true}
                        watermarkPosition="bottom-left"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{artwork.title}</h3>
                        <div className="flex gap-1">
                          {artwork.featured && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Vedette
                            </Badge>
                          )}
                          <Badge variant={artwork.available ? 'default' : 'secondary'}>
                            {artwork.available ? 'Disponible' : 'Indisponible'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{artwork.category}</p>
                      <p className="text-sm text-muted-foreground mb-2">{artwork.size} • {artwork.year}</p>
                      <div className="mb-3">
                        <RatingDisplay
                          rating={getArtworkRating(artwork.id).average}
                          size="sm"
                          showNumber
                          count={getArtworkRating(artwork.id).count}
                        />
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          {artwork.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through mr-2">
                              {formatPrice(artwork.originalPrice)}
                            </span>
                          )}
                          <span className="font-bold text-lg">{formatPrice(artwork.price)}</span>
                        </div>
                        {artwork.offer?.active && (
                          <Badge variant="destructive">
                            -{artwork.offer.type === 'percentage' ? `${artwork.offer.value}%` : `${formatPrice(artwork.offer.value)}`}
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(artwork)}
                          className="col-span-2"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant={artwork.available ? "default" : "secondary"}
                          onClick={() => handleToggleAvailability(artwork.id)}
                          title={artwork.available ? "Rendre indisponible" : "Rendre disponible"}
                          className={`${artwork.available ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"} text-xs`}
                        >
                          {artwork.available ? (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              <span className="hidden xs:inline">Masquer</span>
                              <span className="xs:hidden">Hide</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              <span className="hidden xs:inline">Afficher</span>
                              <span className="xs:hidden">Show</span>
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleFeatured(artwork.id)}
                          className="text-xs"
                        >
                          {artwork.featured ? <StarOff className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(artwork.id)}
                          className="col-span-2 text-xs"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {getFilteredArtworks().map((artwork) => (
                  <div key={artwork.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                    <ProtectedImage
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full sm:w-16 h-32 sm:h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleViewArtwork(artwork)}
                      showWatermark={true}
                      watermarkPosition="bottom-right"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm sm:text-base truncate">{artwork.title}</h3>
                        <div className="flex gap-2 flex-wrap">
                          {artwork.featured && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Vedette
                            </Badge>
                          )}
                          <Badge variant={artwork.available ? 'default' : 'secondary'} className="text-xs">
                            {artwork.available ? 'Disponible' : 'Indisponible'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">{artwork.category} • {artwork.size} • {artwork.year}</p>
                      <div className="mb-2">
                        <RatingDisplay
                          rating={getArtworkRating(artwork.id).average}
                          size="sm"
                          showNumber
                          count={getArtworkRating(artwork.id).count}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-sm sm:text-base">{formatPrice(artwork.price)}</div>
                        {artwork.offer?.active && (
                          <Badge variant="destructive" className="text-xs">
                            -{artwork.offer.type === 'percentage' ? `${artwork.offer.value}%` : `${formatPrice(artwork.offer.value)}`}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(artwork)} className="flex-1 sm:flex-none text-xs">
                        <Edit className="w-3 h-3 mr-1" />
                        <span className="hidden xs:inline">Modifier</span>
                        <span className="xs:hidden">Edit</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant={artwork.available ? "default" : "secondary"}
                        onClick={() => handleToggleAvailability(artwork.id)}
                        title={artwork.available ? "Rendre indisponible" : "Rendre disponible"}
                        className={`${artwork.available ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"} flex-1 sm:flex-none text-xs`}
                      >
                        {artwork.available ? (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            <span className="hidden xs:inline">Masquer</span>
                            <span className="xs:hidden">Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            <span className="hidden xs:inline">Afficher</span>
                            <span className="xs:hidden">Show</span>
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toggleFeatured(artwork.id)} className="text-xs">
                        {artwork.featured ? <StarOff className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(artwork.id)} className="text-xs">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Artwork Form Modal */}
      {showForm && (
        <ArtworkForm
          artwork={editingArtwork}
          onClose={handleCloseForm}
        />
      )}

    </div>
  );
};

export default AdminDashboard;
