'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, Send } from 'lucide-react';
import CommentItem from './CommentItem';

interface Comment {
  id: number;
  submission_id: number;
  user_id: number;
  parent_id: number | null;
  text: string;
  author: string;
  author_role: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  user_vote: 'upvote' | 'downvote' | null;
  is_author: boolean;
}

interface CommentSectionProps {
  submissionId: number;
  currentUserId: number;
  isModerator: boolean;
}

export default function CommentSection({
  submissionId,
  currentUserId,
  isModerator
}: CommentSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/comments?submissionId=${submissionId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && comments.length === 0) {
      loadComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          text: newComment.trim(),
          parentId: null
        })
      });

      if (response.ok) {
        setNewComment('');
        await loadComments();
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: number) => {
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          text: replyText.trim(),
          parentId
        })
      });

      if (response.ok) {
        setReplyText('');
        setReplyingTo(null);
        await loadComments();
      }
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (commentId: number, voteType: 'upvote' | 'downvote') => {
    try {
      const response = await fetch('/api/comments/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, voteType })
      });

      if (response.ok) {
        await loadComments();
      }
    } catch (error) {
      console.error('Failed to vote:', error);
      throw error;
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('Möchtest du diesen Kommentar wirklich löschen?')) return;

    try {
      const response = await fetch('/api/comments/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId })
      });

      if (response.ok) {
        await loadComments();
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleReport = async (commentId: number, reason: string) => {
    try {
      const response = await fetch('/api/comments/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, reason })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to report comment:', error);
      return false;
    }
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
    setReplyText('');
  };

  // Organize comments into threads
  const topLevelComments = comments.filter(c => !c.parent_id);
  const getReplies = (parentId: number) => comments.filter(c => c.parent_id === parentId);

  const renderComment = (comment: Comment, depth = 0) => {
    const replies = getReplies(comment.id);

    return (
      <div key={comment.id}>
        <CommentItem
          comment={comment}
          currentUserId={currentUserId}
          isModerator={isModerator}
          onReply={handleReply}
          onVote={handleVote}
          onDelete={handleDelete}
          onReport={handleReport}
          depth={depth}
        />

        {/* Reply form */}
        {replyingTo === comment.id && (
          <div style={{ marginLeft: `${Math.min((depth + 1) * 2, 8)}rem` }} className="mb-3">
            <div className="bg-white/60 dark:bg-[#2a2520]/60 backdrop-blur-md border border-[#d97757]/20 dark:border-[#e89a7a]/20 rounded-xl p-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Deine Antwort..."
                className="w-full px-3 py-2 rounded-lg border border-[#d97757]/20 dark:border-[#e89a7a]/20 bg-white/50 dark:bg-[#1a1714]/50 text-sm text-[#2a2520] dark:text-[#f5f1ed] placeholder-[#6b635a] dark:placeholder-[#b8aea5] focus:outline-none focus:ring-2 focus:ring-[#d97757] dark:focus:ring-[#e89a7a] resize-none transition-all"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setReplyingTo(null)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-[#6b635a]/10 dark:bg-[#b8aea5]/10 text-[#2a2520] dark:text-[#f5f1ed] hover:bg-[#6b635a]/20 dark:hover:bg-[#b8aea5]/20 transition-all"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={!replyText.trim() || isSubmitting}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-[#7a9b88] dark:bg-[#8faf9d] text-white hover:bg-[#6a8b78] dark:hover:bg-[#7f9f8d] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="h-3 w-3" />
                  {isSubmitting ? 'Wird gesendet...' : 'Antworten'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Render replies recursively */}
        {replies.map(reply => renderComment(reply, depth + 1))}
      </div>
    );
  };

  const commentCount = comments.length;

  return (
    <div className="mt-4">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/40 dark:bg-[#2a2520]/40 backdrop-blur-sm border border-[#d97757]/10 dark:border-[#e89a7a]/10 hover:border-[#d97757]/20 dark:hover:border-[#e89a7a]/20 transition-all"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#7a9b88] dark:text-[#8faf9d]" />
          <span className="font-medium text-[#2a2520] dark:text-[#f5f1ed]">
            Kommentare {commentCount > 0 && `(${commentCount})`}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-[#6b635a] dark:text-[#b8aea5]" />
        ) : (
          <ChevronDown className="h-5 w-5 text-[#6b635a] dark:text-[#b8aea5]" />
        )}
      </button>

      {/* Comments Section */}
      {isOpen && (
        <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
          {/* New Comment Form */}
          <div className="bg-white/60 dark:bg-[#2a2520]/60 backdrop-blur-md border border-[#d97757]/20 dark:border-[#e89a7a]/20 rounded-xl p-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Schreibe einen Kommentar..."
              className="w-full px-4 py-3 rounded-xl border border-[#d97757]/20 dark:border-[#e89a7a]/20 bg-white/50 dark:bg-[#1a1714]/50 text-[#2a2520] dark:text-[#f5f1ed] placeholder-[#6b635a] dark:placeholder-[#b8aea5] focus:outline-none focus:ring-2 focus:ring-[#d97757] dark:focus:ring-[#e89a7a] resize-none transition-all"
              rows={3}
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7a9b88] dark:bg-[#8faf9d] text-white hover:bg-[#6a8b78] dark:hover:bg-[#7f9f8d] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#7a9b88]/30 dark:shadow-[#8faf9d]/30"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Wird gesendet...' : 'Kommentieren'}
              </button>
            </div>
          </div>

          {/* Comments List */}
          {isLoading ? (
            <div className="text-center py-8 text-[#6b635a] dark:text-[#b8aea5]">
              Lädt Kommentare...
            </div>
          ) : commentCount === 0 ? (
            <div className="text-center py-8 text-[#6b635a] dark:text-[#b8aea5]">
              Noch keine Kommentare. Sei der Erste!
            </div>
          ) : (
            <div className="space-y-2">
              {topLevelComments.map(comment => renderComment(comment))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
