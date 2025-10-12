import { useState, useEffect } from 'react';
import { MessageCircle, User, Heart, Reply, Flag, Edit, Trash2, Star, Filter, SortAsc, MoreVertical, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Comment {
  id: string;
  artworkId: string;
  artworkTitle: string;
  artworkImage: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  rating: number;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies: Reply[];
  isEdited: boolean;
  isReported: boolean;
  userLiked?: boolean;
  userDisliked?: boolean;
}

interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  isEdited: boolean;
}

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      artworkId: '1',
      artworkTitle: 'Rêves d\'Orient',
      artworkImage: '/artwork-1.jpg',
      userId: 'user1',
      userName: 'Marie Dubois',
      content: 'Cette œuvre est absolument magnifique ! Les couleurs et la fluidité de l\'aquarelle créent une atmosphère vraiment envoûtante. J\'adore la façon dont l\'artiste capture l\'essence de l\'Orient.',
      rating: 5,
      timestamp: '2024-01-20T14:30:00Z',
      likes: 12,
      dislikes: 0,
      replies: [
        {
          id: 'r1',
          userId: 'user2',
          userName: 'Ahmed Benali',
          content: 'Je suis tout à fait d\'accord ! L\'utilisation de la lumière dans cette pièce est remarquable.',
          timestamp: '2024-01-20T15:45:00Z',
          likes: 3,
          dislikes: 0,
          isEdited: false
        }
      ],
      isEdited: false,
      isReported: false
    },
    {
      id: '2',
      artworkId: '2',
      artworkTitle: 'Harmonie des Couleurs',
      artworkImage: '/artwork-2.jpg',
      userId: 'user3',
      userName: 'Sophie Martin',
      content: 'Une composition audacieuse et moderne. Les contrastes de couleurs sont saisissants et créent une dynamique visuelle impressionnante.',
      rating: 4,
      timestamp: '2024-01-19T10:15:00Z',
      likes: 8,
      dislikes: 1,
      replies: [],
      isEdited: false,
      isReported: false
    },
    {
      id: '3',
      artworkId: '3',
      artworkTitle: 'Émotions du Sud',
      artworkImage: '/artwork-3.jpg',
      userId: 'user4',
      userName: 'Youssef Alami',
      content: 'Cette œuvre évoque tellement d\'émotions ! On ressent vraiment la chaleur et la passion du Sud marocain. Bravo à l\'artiste pour cette magnifique représentation de notre culture.',
      rating: 5,
      timestamp: '2024-01-18T16:20:00Z',
      likes: 15,
      dislikes: 0,
      replies: [
        {
          id: 'r2',
          userId: 'user5',
          userName: 'Fatima Zahra',
          content: 'Exactement ! Cela me rappelle mon enfance à Marrakech. L\'artiste a su capturer l\'âme de notre région.',
          timestamp: '2024-01-18T17:30:00Z',
          likes: 7,
          dislikes: 0,
          isEdited: false
        },
        {
          id: 'r3',
          userId: 'user1',
          userName: 'Marie Dubois',
          content: 'Merci pour ce partage culturel ! C\'est fascinant de voir comment l\'art peut transcender les frontières.',
          timestamp: '2024-01-18T18:15:00Z',
          likes: 4,
          dislikes: 0,
          isEdited: false
        }
      ],
      isEdited: false,
      isReported: false
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState<{[key: string]: string}>({});
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedArtwork, setSelectedArtwork] = useState('all');

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      artworkId: '1',
      artworkTitle: 'Nouvelle œuvre',
      artworkImage: '/artwork-1.jpg',
      userId: 'current-user',
      userName: 'Vous',
      content: newComment,
      rating: 5,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
      isEdited: false,
      isReported: false
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleSubmitReply = (commentId: string) => {
    const replyContent = newReply[commentId];
    if (!replyContent?.trim()) return;

    const reply: Reply = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'Vous',
      content: replyContent,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      isEdited: false
    };

    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ));

    setNewReply({ ...newReply, [commentId]: '' });
  };

  const handleLike = (commentId: string, replyId?: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        if (replyId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === replyId 
                ? { ...reply, likes: reply.likes + 1 }
                : reply
            )
          };
        } else {
          return { ...comment, likes: comment.likes + 1 };
        }
      }
      return comment;
    }));
  };

  const handleDislike = (commentId: string, replyId?: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        if (replyId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === replyId 
                ? { ...reply, dislikes: reply.dislikes + 1 }
                : reply
            )
          };
        } else {
          return { ...comment, dislikes: comment.dislikes + 1 };
        }
      }
      return comment;
    }));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const handleReportComment = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, isReported: true }
        : comment
    ));
  };

  const filteredComments = comments.filter(comment => {
    if (filter === 'reported') return comment.isReported;
    if (selectedArtwork !== 'all') return comment.artworkId === selectedArtwork;
    return true;
  });

  const sortedComments = [...filteredComments].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'popular':
        return (b.likes - b.dislikes) - (a.likes - a.dislikes);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const totalComments = comments.length;
  const totalReplies = comments.reduce((sum, comment) => sum + comment.replies.length, 0);
  const averageRating = comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length;
  const reportedComments = comments.filter(comment => comment.isReported).length;

  const artworks = Array.from(new Set(comments.map(comment => ({
    id: comment.artworkId,
    title: comment.artworkTitle,
    image: comment.artworkImage
  }))));

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-cream via-cream-50 to-warm-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="h-8 w-8 text-burnt-gold mr-3" />
            <h1 className="text-4xl font-display text-deep-charcoal">Commentaires & Discussions</h1>
          </div>
          <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
            Partagez vos impressions, posez vos questions et participez aux discussions autour des œuvres d'art.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="deep-card text-center">
            <CardContent className="p-6">
              <MessageCircle className="h-8 w-8 text-burnt-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-deep-charcoal">{totalComments}</div>
              <div className="text-sm text-charcoal-600">Commentaires</div>
            </CardContent>
          </Card>
          <Card className="deep-card text-center">
            <CardContent className="p-6">
              <Reply className="h-8 w-8 text-burnt-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-deep-charcoal">{totalReplies}</div>
              <div className="text-sm text-charcoal-600">Réponses</div>
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
              <Flag className="h-8 w-8 text-burnt-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-deep-charcoal">{reportedComments}</div>
              <div className="text-sm text-charcoal-600">Signalements</div>
            </CardContent>
          </Card>
        </div>

        {/* New Comment Form */}
        <Card className="deep-card mb-8">
          <CardHeader>
            <CardTitle>Ajouter un commentaire</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Partagez vos impressions sur cette œuvre..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] deep-input"
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <span className="text-sm text-charcoal-600">Note:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-burnt-gold fill-current cursor-pointer hover:opacity-70" />
                ))}
              </div>
              <Button onClick={handleSubmitComment} className="deep-button">
                <Send className="h-4 w-4 mr-2" />
                Publier
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <Tabs value={filter} onValueChange={setFilter} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="reported">Signalés</TabsTrigger>
              <TabsTrigger value="recent">Récents</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-4">
            <select 
              value={selectedArtwork} 
              onChange={(e) => setSelectedArtwork(e.target.value)}
              className="deep-input w-full md:w-48"
            >
              <option value="all">Toutes les œuvres</option>
              {artworks.map(artwork => (
                <option key={artwork.id} value={artwork.id}>
                  {artwork.title}
                </option>
              ))}
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="deep-input w-full md:w-48"
            >
              <option value="recent">Plus récents</option>
              <option value="popular">Plus populaires</option>
              <option value="rating">Meilleures notes</option>
            </select>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {sortedComments.map((comment) => (
            <Card key={comment.id} className="deep-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Comment Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-burnt-gold/10 text-burnt-gold">
                          {comment.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-deep-charcoal">{comment.userName}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-charcoal-500">
                            {new Date(comment.timestamp).toLocaleDateString('fr-FR')}
                          </span>
                          {comment.isEdited && (
                            <Badge variant="outline" className="text-xs">Modifié</Badge>
                          )}
                          {comment.isReported && (
                            <Badge variant="destructive" className="text-xs">Signalé</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setEditingComment(comment.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReportComment(comment.id)}>
                          <Flag className="h-4 w-4 mr-2" />
                          Signaler
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Artwork Reference */}
                  <div className="flex items-center gap-3 p-3 bg-charcoal-50 rounded-lg">
                    <img 
                      src={comment.artworkImage} 
                      alt={comment.artworkTitle}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <h5 className="text-sm font-medium text-deep-charcoal">{comment.artworkTitle}</h5>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < comment.rating ? 'text-burnt-gold fill-current' : 'text-charcoal-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Comment Content */}
                  <p className="text-charcoal-700 leading-relaxed">{comment.content}</p>

                  {/* Comment Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-charcoal-200">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(comment.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDislike(comment.id)}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        {comment.dislikes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Reply className="h-4 w-4 mr-1" />
                        Répondre
                      </Button>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-6 space-y-3 pt-4 border-l-2 border-charcoal-200 pl-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-burnt-gold/10 text-burnt-gold text-sm">
                                {reply.userName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-deep-charcoal">{reply.userName}</span>
                            <span className="text-xs text-charcoal-500">
                              {new Date(reply.timestamp).toLocaleDateString('fr-FR')}
                            </span>
                            {reply.isEdited && (
                              <Badge variant="outline" className="text-xs">Modifié</Badge>
                            )}
                          </div>
                          <p className="text-sm text-charcoal-700 ml-10">{reply.content}</p>
                          <div className="flex items-center gap-2 ml-10">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(comment.id, reply.id)}
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {reply.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDislike(comment.id, reply.id)}
                            >
                              <ThumbsDown className="h-3 w-3 mr-1" />
                              {reply.dislikes}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  <div className="ml-6 pt-3 border-l-2 border-charcoal-200 pl-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Répondre à ce commentaire..."
                        value={newReply[comment.id] || ''}
                        onChange={(e) => setNewReply({...newReply, [comment.id]: e.target.value})}
                        className="flex-1 deep-input"
                        rows={2}
                      />
                      <Button 
                        onClick={() => handleSubmitReply(comment.id)}
                        className="deep-button"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedComments.length === 0 && (
          <div className="text-center py-16">
            <MessageCircle className="h-16 w-16 text-charcoal-400 mx-auto mb-4" />
            <h3 className="text-xl font-display text-charcoal-600 mb-2">Aucun commentaire pour le moment</h3>
            <p className="text-charcoal-500 mb-6">Soyez le premier à partager votre avis sur cette œuvre</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
