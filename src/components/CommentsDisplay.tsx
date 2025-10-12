import React, { useState } from 'react';
import { Heart, Reply, Flag, MoreVertical, User, Calendar, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import StarRating from './StarRating';

interface Comment {
  id: string;
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
}

interface Reply {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
}

interface CommentsDisplayProps {
  comments: Comment[];
  onLikeComment: (commentId: string) => void;
  onDislikeComment: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
  onReport: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  className?: string;
}

const CommentsDisplay: React.FC<CommentsDisplayProps> = ({
  comments,
  onLikeComment,
  onDislikeComment,
  onReply,
  onReport,
  onDelete,
  className
}) => {
  const [replyText, setReplyText] = useState<{[key: string]: string}>({});
  const [showReplyForm, setShowReplyForm] = useState<{[key: string]: boolean}>({});

  const handleReply = (commentId: string) => {
    const content = replyText[commentId];
    if (content?.trim()) {
      onReply(commentId, content.trim());
      setReplyText({ ...replyText, [commentId]: '' });
      setShowReplyForm({ ...showReplyForm, [commentId]: false });
    }
  };

  const toggleReplyForm = (commentId: string) => {
    setShowReplyForm({ ...showReplyForm, [commentId]: !showReplyForm[commentId] });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a quelques minutes';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return 'Hier';
    return date.toLocaleDateString('fr-FR');
  };

  if (comments.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="p-4 bg-charcoal-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <User className="h-8 w-8 text-charcoal-400" />
        </div>
        <h3 className="text-lg font-display text-deep-charcoal mb-2">Aucun commentaire pour le moment</h3>
        <p className="text-charcoal-600">Soyez le premier à partager votre avis sur cette œuvre !</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-display text-deep-charcoal">
          Commentaires ({comments.length})
        </h3>
      </div>

      {comments.map((comment) => (
        <div key={comment.id} className="deep-card p-6">
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-burnt-gold/10 text-burnt-gold font-medium">
                  {comment.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium text-deep-charcoal">{comment.userName}</h4>
                <div className="flex items-center gap-2">
                  <StarRating rating={comment.rating} size="sm" />
                  <span className="text-sm text-charcoal-500">
                    {formatDate(comment.timestamp)}
                  </span>
                  {comment.isEdited && (
                    <Badge variant="outline" className="text-xs">Modifié</Badge>
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
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onReport(comment.id)}>
                  <Flag className="h-4 w-4 mr-2" />
                  Signaler
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(comment.id)}
                  className="text-red-600"
                >
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Comment Content */}
          <p className="text-charcoal-700 leading-relaxed mb-4">{comment.content}</p>

          {/* Comment Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-charcoal-200">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLikeComment(comment.id)}
                className="flex items-center gap-1 hover:bg-green-50 hover:text-green-600"
              >
                <ThumbsUp className="h-4 w-4" />
                {comment.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDislikeComment(comment.id)}
                className="flex items-center gap-1 hover:bg-red-50 hover:text-red-600"
              >
                <ThumbsDown className="h-4 w-4" />
                {comment.dislikes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleReplyForm(comment.id)}
                className="flex items-center gap-1"
              >
                <Reply className="h-4 w-4" />
                Répondre
              </Button>
            </div>
          </div>

          {/* Reply Form */}
          {showReplyForm[comment.id] && (
            <div className="mt-4 pt-4 border-t border-charcoal-100">
              <div className="flex gap-2">
                <textarea
                  placeholder="Répondre à ce commentaire..."
                  value={replyText[comment.id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                  className="flex-1 deep-input min-h-[80px] resize-none"
                  maxLength={300}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleReply(comment.id)}
                    disabled={!replyText[comment.id]?.trim()}
                    className="deep-button"
                  >
                    <Reply className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowReplyForm({ ...showReplyForm, [comment.id]: false });
                      setReplyText({ ...replyText, [comment.id]: '' });
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="ml-6 p-4 bg-charcoal-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-burnt-gold/10 text-burnt-gold text-xs">
                        {reply.userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-deep-charcoal">{reply.userName}</span>
                    <span className="text-xs text-charcoal-500">{formatDate(reply.timestamp)}</span>
                  </div>
                  <p className="text-sm text-charcoal-700 ml-8">{reply.content}</p>
                  <div className="flex items-center gap-2 ml-8 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {reply.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      {reply.dislikes}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentsDisplay;
