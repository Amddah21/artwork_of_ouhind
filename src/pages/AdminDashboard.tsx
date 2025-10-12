import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Eye, 
  EyeOff, 
  Activity, 
  Shield, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  RefreshCw,
  Download,
  Filter,
  Search,
  Upload,
  Image,
  Edit,
  Trash2,
  Save,
  X,
  Plus,
  Palette,
  Calendar,
  Tag,
  FileText,
  Maximize,
  ZoomIn,
  RotateCcw,
  Heart,
  Share2,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

// Types
interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  category: 'auth' | 'artwork' | 'user' | 'system' | 'security';
  message: string;
  details?: any;
  userAgent?: string;
  ipAddress?: string;
}

interface DashboardStats {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  artworkViews: number;
  errorCount: number;
  lastActivity: Date;
}

interface Artwork {
  id: string;
  title: string;
  description: string;
  year: number;
  medium: string;
  dimensions: string;
  category: string;
  tags: string[];
  price?: number;
  isAvailable: boolean;
  imageUrl: string;
  thumbnailUrl?: string;
  multipleViews?: string[];
  story?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Logs state
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalVisits: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    artworkViews: 0,
    errorCount: 0,
    lastActivity: new Date()
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Artwork management state
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    medium: '',
    dimensions: '',
    category: '',
    tags: '',
    price: '',
    story: '',
    isAvailable: true
  });

  // Sample log data - in a real app, this would come from your backend
  const generateSampleLogs = (): LogEntry[] => {
    return [];
  };

  // Load logs and stats
  useEffect(() => {
    const loadData = () => {
      const sampleLogs = generateSampleLogs();
      setLogs(sampleLogs);
      
      // Generate sample stats
      setStats({
        totalVisits: 0,
        uniqueVisitors: 0,
        pageViews: 0,
        artworkViews: 0,
        errorCount: 0,
        lastActivity: new Date()
      });
    };

    loadData();

    // Auto-refresh every 30 seconds if enabled
    if (autoRefresh) {
      const interval = setInterval(loadData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Filter logs
  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, levelFilter, categoryFilter]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLevelBadge = (level: string) => {
    const variants = {
      error: 'destructive',
      warning: 'secondary',
      success: 'default',
      info: 'outline'
    } as const;

    return (
      <Badge variant={variants[level as keyof typeof variants] || 'outline'}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Category', 'Message', 'IP Address', 'User Agent'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.level,
        log.category,
        `"${log.message}"`,
        log.ipAddress || '',
        `"${log.userAgent || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const refreshData = () => {
    const sampleLogs = generateSampleLogs();
    setLogs(sampleLogs);
    
    setStats({
      totalVisits: 0,
      uniqueVisitors: 0,
      pageViews: 0,
      artworkViews: 0,
      errorCount: 0,
      lastActivity: new Date()
    });
  };

  // Artwork management functions
  const generateSampleArtworks = (): Artwork[] => {
    return [];
  };

  // Initialize artworks
  useEffect(() => {
    setArtworks(generateSampleArtworks());
  }, []);

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      year: new Date().getFullYear(),
      medium: '',
      dimensions: '',
      category: '',
      tags: '',
      price: '',
      story: '',
      isAvailable: true
    });
    setUploadedImage(null);
    setImagePreview('');
    setEditingArtwork(null);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !imagePreview) {
      alert('Please fill in all required fields and upload an image.');
      return;
    }

    const newArtwork: Artwork = {
      id: editingArtwork?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      year: formData.year,
      medium: formData.medium,
      dimensions: formData.dimensions,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      price: formData.price ? parseFloat(formData.price) : undefined,
      story: formData.story,
      isAvailable: formData.isAvailable,
      imageUrl: imagePreview,
      createdAt: editingArtwork?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingArtwork) {
      setArtworks(prev => prev.map(art => art.id === editingArtwork.id ? newArtwork : art));
    } else {
      setArtworks(prev => [...prev, newArtwork]);
    }

    setIsUploadModalOpen(false);
    resetForm();
  };

  const handleEdit = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setFormData({
      title: artwork.title,
      description: artwork.description,
      year: artwork.year,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      category: artwork.category,
      tags: artwork.tags.join(', '),
      price: artwork.price?.toString() || '',
      story: artwork.story || '',
      isAvailable: artwork.isAvailable
    });
    setImagePreview(artwork.imageUrl);
    setIsUploadModalOpen(true);
  };

  const handleDelete = (artworkId: string) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      setArtworks(prev => prev.filter(art => art.id !== artworkId));
    }
  };

  const handleViewDetails = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsDetailModalOpen(true);
    setCurrentImageIndex(0);
  };

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (!selectedArtwork?.multipleViews) return;
    const totalImages = selectedArtwork.multipleViews.length + 1; // +1 for main image
    setCurrentImageIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % totalImages;
      } else {
        return prev === 0 ? totalImages - 1 : prev - 1;
      }
    });
  };

  const getCurrentImage = () => {
    if (!selectedArtwork) return '';
    if (currentImageIndex === 0) return selectedArtwork.imageUrl;
    return selectedArtwork.multipleViews?.[currentImageIndex - 1] || selectedArtwork.imageUrl;
  };

  const simulateLoading = async (duration: number = 1000) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6" style={{backgroundColor: '#222222'}}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold comfort-text" style={{color: '#F8F8F8'}}>Tableau de Bord Admin</h1>
              <p className="text-primary-foreground/80 mt-2 comfort-text-muted" style={{color: '#7A6B5A'}}>
                Surveillez l'activité de votre galerie et les logs système
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => navigate('/')}
                className="comfort-button-secondary text-white border-white/30"
                style={{backgroundColor: 'rgba(122, 107, 90, 0.2)', borderColor: '#7A6B5A'}}
              >
                <Eye className="w-4 h-4 mr-2" />
                Voir le Site
              </Button>
              <Button
                variant="secondary"
                onClick={refreshData}
                className="comfort-button-secondary text-white border-white/30"
                style={{backgroundColor: 'rgba(122, 107, 90, 0.2)', borderColor: '#7A6B5A'}}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visites Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVisits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Aucune donnée disponible
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visiteurs Uniques</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Aucune donnée disponible
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vues d'Œuvres</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.artworkViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Aucune donnée disponible
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Erreurs</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.errorCount}</div>
              <p className="text-xs text-muted-foreground">
                Aucune donnée disponible
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="artworks" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="artworks">Gestion des Œuvres</TabsTrigger>
              <TabsTrigger value="logs">Journaux d'Activité</TabsTrigger>
              <TabsTrigger value="analytics">Analyses</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant={autoRefresh ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Actualisation Auto
                </Button>
              </div>
            </div>
          </div>

          {/* Artwork Management Tab */}
          <TabsContent value="artworks" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold comfort-text" style={{color: '#333333'}}>Gestion des Œuvres</h2>
                <p className="text-muted-foreground comfort-text-muted">Gérez votre collection de galerie</p>
              </div>
              <Button 
                onClick={() => setIsUploadModalOpen(true)} 
                className="comfort-button comfort-focus"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une Œuvre
              </Button>
            </div>

            {/* Artworks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map((artwork, index) => (
                <Card 
                  key={artwork.id} 
                  className="overflow-hidden animate-hover-lift animate-fade-in-scroll"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-square relative overflow-hidden group">
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full h-full object-cover animate-zoom-in transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    {/* Availability Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge 
                        className={`text-xs font-semibold ${
                          artwork.isAvailable 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {artwork.isAvailable ? 'Disponible' : 'Indisponible'}
                      </Badge>
                    </div>
                    
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                        onClick={() => handleEdit(artwork)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-500"
                        onClick={() => handleDelete(artwork.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white text-foreground"
                        onClick={() => handleViewDetails(artwork)}
                      >
                        <ZoomIn className="w-3 h-3 mr-1" />
                        Voir
                      </Button>
                    </div>
                    {!artwork.isAvailable && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary" className="bg-yellow-500 text-white font-accent text-lg">
                          Indisponible
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="heading-md font-display mb-2 line-clamp-1" style={{color: '#2C2C2C'}}>{artwork.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2 font-body">{artwork.description}</p>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span className="font-body">{artwork.year}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Palette className="w-3 h-3" />
                        <span className="font-body">{artwork.medium}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Maximize className="w-3 h-3" />
                        <span className="font-body">{artwork.dimensions}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3" />
                        <span className="font-body">{artwork.category}</span>
                      </div>
                      {artwork.price && (
                        <div className="text-sm font-semibold text-foreground font-body">
                          €{artwork.price.toLocaleString()}
                        </div>
                      )}
                    </div>
                    {artwork.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {artwork.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs font-body">
                            {tag}
                          </Badge>
                        ))}
                        {artwork.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs font-body">
                            +{artwork.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {artworks.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Image className="w-16 h-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune œuvre pour le moment</h3>
                  <p className="text-muted-foreground mb-4">Commencez à construire votre galerie en ajoutant votre première œuvre.</p>
                  <Button 
                    onClick={() => setIsUploadModalOpen(true)} 
                    className="btn-primary"
                    style={{backgroundColor: '#D4AF37', borderColor: '#D4AF37', color: '#FFFFFF'}}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter votre Première Œuvre
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rechercher</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Rechercher dans les logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Niveau</label>
                    <Select value={levelFilter} onValueChange={setLevelFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les niveaux" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les Niveaux</SelectItem>
                        <SelectItem value="error">Erreur</SelectItem>
                        <SelectItem value="warning">Avertissement</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Succès</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Catégorie</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les catégories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les Catégories</SelectItem>
                        <SelectItem value="auth">Authentification</SelectItem>
                        <SelectItem value="artwork">Œuvre</SelectItem>
                        <SelectItem value="user">Utilisateur</SelectItem>
                        <SelectItem value="system">Système</SelectItem>
                        <SelectItem value="security">Sécurité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logs Table */}
            <Card>
              <CardHeader>
                <CardTitle>Journaux d'Activité</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Affichage de {filteredLogs.length} sur {logs.length} entrées
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getLevelIcon(log.level)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getLevelBadge(log.level)}
                          <Badge variant="outline" className="text-xs">
                            {log.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {log.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-1">{log.message}</p>
                        {log.details && (
                          <details className="text-xs text-muted-foreground">
                            <summary className="cursor-pointer hover:text-foreground">
                              Détails
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          {log.ipAddress && (
                            <span>IP: {log.ipAddress}</span>
                          )}
                          {log.userAgent && (
                            <span className="truncate max-w-xs">
                              UA: {log.userAgent.substring(0, 50)}...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredLogs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucun log trouvé correspondant à vos filtres.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu des Analyses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Tableau de bord d'analyses bientôt disponible...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Surveillance de Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Tentatives de Connexion Échouées</h3>
                      <p className="text-2xl font-bold text-red-500">3</p>
                      <p className="text-sm text-muted-foreground">Dernières 24 heures</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Activité Suspecte</h3>
                      <p className="text-2xl font-bold text-yellow-500">1</p>
                      <p className="text-sm text-muted-foreground">Surveillance en cours</p>
                    </div>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Fonctionnalités de surveillance de sécurité bientôt disponibles...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">
                {editingArtwork ? 'Modifier l\'Œuvre' : 'Ajouter une Nouvelle Œuvre'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  resetForm();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Image de l'Œuvre</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragOver ? 'border-accent bg-accent/5' : 'border-muted-foreground/25'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setImagePreview('');
                            setUploadedImage(null);
                          }}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Supprimer l'Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                        <div>
                          <p className="text-lg font-medium">Déposez votre image ici</p>
                          <p className="text-sm text-muted-foreground">ou cliquez pour parcourir</p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choisir un Fichier
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Titre *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Entrez le titre de l'œuvre"
                      />
                    </div>
                    <div>
                      <Label htmlFor="year">Année</Label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                        placeholder="2024"
                      />
                    </div>
                  </div>

                  <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Décrivez votre œuvre..."
                        rows={3}
                      />
                  </div>

                  <div>
                    <Label htmlFor="story">Histoire de cette Œuvre</Label>
                    <Textarea
                      id="story"
                      value={formData.story}
                      onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
                      placeholder="Partagez l'inspiration, le processus ou la signification de cette œuvre..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="medium">Médium</Label>
                      <Input
                        id="medium"
                        value={formData.medium}
                        onChange={(e) => setFormData(prev => ({ ...prev, medium: e.target.value }))}
                        placeholder="Huile sur toile, Aquarelle..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="dimensions">Dimensions</Label>
                      <Input
                        id="dimensions"
                        value={formData.dimensions}
                        onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                        placeholder="60 x 80 cm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Catégorie</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Aquarelle">Aquarelle</SelectItem>
                          <SelectItem value="Huile">Huile</SelectItem>
                          <SelectItem value="Acrylique">Acrylique</SelectItem>
                          <SelectItem value="Moderne">Moderne</SelectItem>
                          <SelectItem value="Abstrait">Abstrait</SelectItem>
                          <SelectItem value="Nature">Nature</SelectItem>
                          <SelectItem value="Portrait">Portrait</SelectItem>
                          <SelectItem value="Paysage">Paysage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="price">Price (€)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="450"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="Enter tags separated by commas (e.g., nature, abstract, modern)"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isAvailable"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="isAvailable">Disponible à la vente</Label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="btn-primary"
                  style={{backgroundColor: '#D4AF37', borderColor: '#D4AF37', color: '#FFFFFF'}}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingArtwork ? 'Update Artwork' : 'Add Artwork'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Artwork Detail Modal */}
      {isDetailModalOpen && selectedArtwork && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-background to-accent/5">
              <div>
                <h2 className="heading-lg font-display" style={{color: '#2C2C2C'}}>
                  {selectedArtwork.title}
                </h2>
                <p className="text-muted-foreground font-body">
                  {selectedArtwork.year} • {selectedArtwork.medium}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="hover:bg-accent/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Modal Content - 60/40 Layout */}
            <div className="flex h-[calc(95vh-120px)]">
              {/* Left Side - Image Section (60%) */}
              <div className="w-3/5 relative bg-gradient-to-br from-muted/20 to-background">
                <div className="relative h-full overflow-hidden">
                  <img
                    src={getCurrentImage()}
                    alt={selectedArtwork.title}
                    className="w-full h-full object-contain animate-fade-in transition-all duration-500"
                  />
                  
                  {/* Image Navigation */}
                  {selectedArtwork.multipleViews && selectedArtwork.multipleViews.length > 0 && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={() => handleImageNavigation('prev')}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={() => handleImageNavigation('next')}
                      >
                        <RotateCcw className="w-4 h-4 rotate-180" />
                      </Button>
                    </>
                  )}

                  {/* Image Counter */}
                  {selectedArtwork.multipleViews && selectedArtwork.multipleViews.length > 0 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                      <Badge variant="secondary" className="bg-white/90 text-foreground">
                        {currentImageIndex + 1} / {(selectedArtwork.multipleViews.length || 0) + 1}
                      </Badge>
                    </div>
                  )}

                  {/* Zoom Indicator */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      <ZoomIn className="w-3 h-3 mr-1" />
                      High Resolution
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Right Side - Details Section (40%) */}
              <div className="w-2/5 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Title & Year */}
                  <div className="animate-fade-in-scroll">
                    <h1 className="heading-xl font-display mb-2" style={{color: '#2C2C2C'}}>
                      {selectedArtwork.title}
                    </h1>
                    <div className="flex items-center gap-4 text-muted-foreground font-body">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {selectedArtwork.year}
                      </span>
                      <span className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        {selectedArtwork.category}
                      </span>
                    </div>
                  </div>

                  {/* Medium & Dimensions */}
                  <div className="animate-fade-in-scroll" style={{ animationDelay: '100ms' }}>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-gradient-to-r from-accent/5 to-transparent rounded-lg border border-accent/10">
                        <div className="flex items-center gap-3">
                          <Palette className="w-5 h-5 text-accent" />
                          <div>
                            <p className="text-sm text-muted-foreground font-body">Medium</p>
                            <p className="font-semibold font-body">{selectedArtwork.medium}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-accent/5 to-transparent rounded-lg border border-accent/10">
                        <div className="flex items-center gap-3">
                          <Maximize className="w-5 h-5 text-accent" />
                          <div>
                            <p className="text-sm text-muted-foreground font-body">Dimensions</p>
                            <p className="font-semibold font-body">{selectedArtwork.dimensions}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Story behind the piece */}
                  <div className="animate-fade-in-scroll" style={{ animationDelay: '200ms' }}>
                    <h3 className="heading-md font-display mb-3" style={{color: '#2C2C2C'}}>
                      The Story Behind This Piece
                    </h3>
                    <div className="relative">
                      <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-accent/50 rounded-full" />
                      <p className="text-muted-foreground leading-relaxed font-body pl-4 italic">
                        {selectedArtwork.story || selectedArtwork.description}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedArtwork.tags.length > 0 && (
                    <div className="animate-fade-in-scroll" style={{ animationDelay: '300ms' }}>
                      <h4 className="font-semibold mb-3 font-body" style={{color: '#2C2C2C'}}>
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedArtwork.tags.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="font-body hover:bg-accent/10 transition-colors duration-200"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price/Availability */}
                  <div className="animate-fade-in-scroll" style={{ animationDelay: '400ms' }}>
                    <div className="p-6 bg-gradient-to-r from-accent/10 to-transparent rounded-lg border border-accent/20">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground font-body">Price</p>
                          <p className="text-2xl font-bold font-display" style={{color: '#D4AF37'}}>
                            {selectedArtwork.price ? `€${selectedArtwork.price.toLocaleString()}` : 'Price on Request'}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={selectedArtwork.isAvailable ? "default" : "secondary"}
                            className={selectedArtwork.isAvailable ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}
                          >
                            {selectedArtwork.isAvailable ? 'Disponible' : 'Indisponible'}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 font-body"
                          style={{backgroundColor: '#D4AF37', borderColor: '#D4AF37', color: '#FFFFFF'}}
                          disabled={!selectedArtwork.isAvailable}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {selectedArtwork.isAvailable ? 'Faire une demande' : 'Indisponible'}
                        </Button>
                        <Button variant="outline" className="font-body">
                          <Heart className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" className="font-body">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-8 rounded-lg animate-loading">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
              <span className="font-body">Loading...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
