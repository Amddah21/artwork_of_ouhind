import { useState, useEffect } from 'react';
import { Star, TrendingUp, Award, Users, ThumbsUp, ThumbsDown, MessageCircle, Eye, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VotingData {
  id: string;
  title: string;
  artist: string;
  image: string;
  year: number;
  medium: string;
  category: string;
  totalVotes: number;
  averageRating: number;
  ratingDistribution: number[];
  upvotes: number;
  downvotes: number;
  comments: number;
  views: number;
  lastVoted: string;
  tags: string[];
}

const Voting = () => {
  const [votingData, setVotingData] = useState<VotingData[]>([
    {
      id: '1',
      title: 'Rêves d\'Orient',
      artist: 'Mamany-Art',
      image: '/artwork-1.jpg',
      year: 2023,
      medium: 'Aquarelle sur papier',
      category: 'Aquarelle',
      totalVotes: 156,
      averageRating: 4.8,
      ratingDistribution: [2, 5, 12, 45, 92],
      upvotes: 142,
      downvotes: 14,
      comments: 24,
      views: 1250,
      lastVoted: '2024-01-20',
      tags: ['Impressionniste', 'Aquarelle', 'Rêves']
    },
    {
      id: '2',
      title: 'Harmonie des Couleurs',
      artist: 'Mamany-Art',
      image: '/artwork-2.jpg',
      year: 2023,
      medium: 'Huile sur toile',
      category: 'Peinture',
      totalVotes: 134,
      averageRating: 4.9,
      ratingDistribution: [1, 3, 8, 38, 84],
      upvotes: 128,
      downvotes: 6,
      comments: 18,
      views: 980,
      lastVoted: '2024-01-19',
      tags: ['Abstrait', 'Couleurs', 'Moderne']
    },
    {
      id: '3',
      title: 'Émotions du Sud',
      artist: 'Mamany-Art',
      image: '/artwork-3.jpg',
      year: 2022,
      medium: 'Technique mixte',
      category: 'Mixte',
      totalVotes: 89,
      averageRating: 4.7,
      ratingDistribution: [3, 7, 15, 32, 32],
      upvotes: 82,
      downvotes: 7,
      comments: 31,
      views: 756,
      lastVoted: '2024-01-18',
      tags: ['Émotions', 'Culture', 'Tradition']
    },
    {
      id: '4',
      title: 'Lumières du Désert',
      artist: 'Mamany-Art',
      image: '/artwork-4.jpg',
      year: 2023,
      medium: 'Aquarelle sur toile',
      category: 'Aquarelle',
      totalVotes: 78,
      averageRating: 4.6,
      ratingDistribution: [4, 6, 18, 28, 22],
      upvotes: 71,
      downvotes: 7,
      comments: 15,
      views: 634,
      lastVoted: '2024-01-17',
      tags: ['Désert', 'Lumière', 'Nature']
    },
    {
      id: '5',
      title: 'Reflets Urbains',
      artist: 'Mamany-Art',
      image: '/artwork-5.jpg',
      year: 2022,
      medium: 'Huile sur bois',
      category: 'Peinture',
      totalVotes: 95,
      averageRating: 4.5,
      ratingDistribution: [5, 8, 20, 35, 27],
      upvotes: 86,
      downvotes: 9,
      comments: 22,
      views: 892,
      lastVoted: '2024-01-16',
      tags: ['Urbain', 'Reflets', 'Contemporain']
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [userVotes, setUserVotes] = useState<{[key: string]: 'up' | 'down' | null}>({});

  const handleVote = (artworkId: string, voteType: 'up' | 'down') => {
    const currentVote = userVotes[artworkId];
    let newVoteType: 'up' | 'down' | null = voteType;
    
    // Toggle vote if clicking the same type
    if (currentVote === voteType) {
      newVoteType = null;
    }

    setUserVotes(prev => ({
      ...prev,
      [artworkId]: newVoteType
    }));

    // Update artwork voting data
    setVotingData(prev => prev.map(artwork => {
      if (artwork.id === artworkId) {
        let newUpvotes = artwork.upvotes;
        let newDownvotes = artwork.downvotes;

        // Remove previous vote if exists
        if (currentVote === 'up') newUpvotes--;
        if (currentVote === 'down') newDownvotes--;

        // Add new vote
        if (newVoteType === 'up') newUpvotes++;
        if (newVoteType === 'down') newDownvotes++;

        return {
          ...artwork,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          totalVotes: newUpvotes + newDownvotes
        };
      }
      return artwork;
    }));
  };

  const filteredData = votingData.filter(artwork => {
    if (selectedCategory === 'all') return true;
    return artwork.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.averageRating - a.averageRating;
      case 'votes':
        return b.totalVotes - a.totalVotes;
      case 'views':
        return b.views - a.views;
      case 'comments':
        return b.comments - a.comments;
      case 'recent':
        return new Date(b.lastVoted).getTime() - new Date(a.lastVoted).getTime();
      default:
        return 0;
    }
  });

  const totalVotes = votingData.reduce((sum, artwork) => sum + artwork.totalVotes, 0);
  const averageRating = votingData.reduce((sum, artwork) => sum + artwork.averageRating, 0) / votingData.length;
  const totalViews = votingData.reduce((sum, artwork) => sum + artwork.views, 0);
  const totalComments = votingData.reduce((sum, artwork) => sum + artwork.comments, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-cream via-cream-50 to-warm-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="h-8 w-8 text-burnt-gold mr-3" />
            <h1 className="text-4xl font-display text-deep-charcoal">Votes & Évaluations</h1>
          </div>
          <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
            Découvrez les œuvres les plus appréciées et participez à l'évaluation de la collection artistique.
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="deep-card text-center">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-burnt-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-deep-charcoal">{totalVotes.toLocaleString()}</div>
              <div className="text-sm text-charcoal-600">Votes totaux</div>
            </CardContent>
          </Card>
          <Card className="deep-card text-center">
            <CardContent className="p-6">
              <Star className="h-8 w-8 text-burnt-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-deep-charcoal">{averageRating.toFixed(1)}</div>
              <div className="text-sm text-charcoal-600">Note moyenne</div>
            </CardContent>
          </Card>
          <Card className="deep-card text-center">
            <CardContent className="p-6">
              <Eye className="h-8 w-8 text-burnt-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-deep-charcoal">{totalViews.toLocaleString()}</div>
              <div className="text-sm text-charcoal-600">Vues totales</div>
            </CardContent>
          </Card>
          <Card className="deep-card text-center">
            <CardContent className="p-6">
              <MessageCircle className="h-8 w-8 text-burnt-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-deep-charcoal">{totalComments}</div>
              <div className="text-sm text-charcoal-600">Commentaires</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
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
            <option value="rating">Trier par: Note</option>
            <option value="votes">Trier par: Votes</option>
            <option value="views">Trier par: Vues</option>
            <option value="comments">Trier par: Commentaires</option>
            <option value="recent">Trier par: Récent</option>
          </select>
        </div>

        {/* Voting Cards */}
        <div className="space-y-6">
          {sortedData.map((artwork) => (
            <Card key={artwork.id} className="deep-card">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Image */}
                  <div className="lg:col-span-1">
                    <img 
                      src={artwork.image} 
                      alt={artwork.title}
                      className="w-full h-64 lg:h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-display text-deep-charcoal mb-1">{artwork.title}</h3>
                        <p className="text-charcoal-600">{artwork.artist} • {artwork.year}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-burnt-gold/10 text-burnt-gold border-burnt-gold/20">
                            {artwork.category}
                          </Badge>
                          <span className="text-sm text-charcoal-500">{artwork.medium}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-5 w-5 text-burnt-gold fill-current" />
                          <span className="text-lg font-bold text-deep-charcoal">{artwork.averageRating}</span>
                        </div>
                        <div className="text-sm text-charcoal-500">{artwork.totalVotes} votes</div>
                      </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-deep-charcoal">Distribution des notes</h4>
                      {[5, 4, 3, 2, 1].map((rating, index) => {
                        const count = artwork.ratingDistribution[4 - index];
                        const percentage = (count / artwork.totalVotes) * 100;
                        return (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm text-charcoal-600 w-6">{rating}★</span>
                            <Progress value={percentage} className="flex-1 h-2" />
                            <span className="text-sm text-charcoal-500 w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Engagement Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-charcoal-50 rounded-lg">
                        <Eye className="h-5 w-5 text-burnt-gold mx-auto mb-1" />
                        <div className="text-lg font-bold text-deep-charcoal">{artwork.views}</div>
                        <div className="text-xs text-charcoal-500">Vues</div>
                      </div>
                      <div className="text-center p-3 bg-charcoal-50 rounded-lg">
                        <MessageCircle className="h-5 w-5 text-burnt-gold mx-auto mb-1" />
                        <div className="text-lg font-bold text-deep-charcoal">{artwork.comments}</div>
                        <div className="text-xs text-charcoal-500">Commentaires</div>
                      </div>
                      <div className="text-center p-3 bg-charcoal-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-burnt-gold mx-auto mb-1" />
                        <div className="text-lg font-bold text-deep-charcoal">
                          {new Date(artwork.lastVoted).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-xs text-charcoal-500">Dernier vote</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {artwork.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Voting Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-charcoal-200">
                      <div className="flex items-center gap-4">
                        <Button
                          variant={userVotes[artwork.id] === 'up' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleVote(artwork.id, 'up')}
                          className={userVotes[artwork.id] === 'up' ? 'deep-button' : ''}
                        >
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          {artwork.upvotes}
                        </Button>
                        <Button
                          variant={userVotes[artwork.id] === 'down' ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={() => handleVote(artwork.id, 'down')}
                        >
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          {artwork.downvotes}
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Commenter
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Performers */}
        <div className="mt-16">
          <h2 className="text-2xl font-display text-deep-charcoal text-center mb-8">Performances</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="deep-card text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Award className="h-5 w-5 text-burnt-gold" />
                  Meilleure Note
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={sortedData[0]?.image} 
                  alt={sortedData[0]?.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-display text-deep-charcoal">{sortedData[0]?.title}</h4>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Star className="h-4 w-4 text-burnt-gold fill-current" />
                  <span className="font-bold">{sortedData[0]?.averageRating}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="deep-card text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-5 w-5 text-burnt-gold" />
                  Plus de Votes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={votingData.sort((a, b) => b.totalVotes - a.totalVotes)[0]?.image} 
                  alt={votingData.sort((a, b) => b.totalVotes - a.totalVotes)[0]?.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-display text-deep-charcoal">{votingData.sort((a, b) => b.totalVotes - a.totalVotes)[0]?.title}</h4>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Users className="h-4 w-4 text-burnt-gold" />
                  <span className="font-bold">{votingData.sort((a, b) => b.totalVotes - a.totalVotes)[0]?.totalVotes} votes</span>
                </div>
              </CardContent>
            </Card>

            <Card className="deep-card text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Eye className="h-5 w-5 text-burnt-gold" />
                  Plus Vues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={votingData.sort((a, b) => b.views - a.views)[0]?.image} 
                  alt={votingData.sort((a, b) => b.views - a.views)[0]?.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-display text-deep-charcoal">{votingData.sort((a, b) => b.views - a.views)[0]?.title}</h4>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Eye className="h-4 w-4 text-burnt-gold" />
                  <span className="font-bold">{votingData.sort((a, b) => b.views - a.views)[0]?.views} vues</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voting;
