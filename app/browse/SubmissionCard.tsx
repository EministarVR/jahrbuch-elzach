'use client';

import { useState, useEffect, useRef } from 'react';
import { ThumbsUp, ThumbsDown, MoreVertical, Flag, Trash2, Ban, X } from 'lucide-react';
import type { Submission } from './page';
import CommentSection from './CommentSection';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import PromptDialog from '@/components/ui/PromptDialog';

interface SubmissionCardProps {
  submission: Submission;
  userVote: 'upvote' | 'downvote' | null;
  isModerator: boolean;
  currentUserId: number;
  onVote: (submissionId: number, voteType: 'upvote' | 'downvote') => Promise<void>;
  onReport: (submissionId: number, reason: string) => Promise<boolean>;
  onModerate: (submissionId: number, action: 'delete' | 'ban', reason?: string) => Promise<boolean>;
}

export default function SubmissionCard({
  submission,
  userVote: initialUserVote,
  isModerator,
  currentUserId,
  onVote,
  onReport,
  onModerate,
}: SubmissionCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Custom dialog states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBanPrompt, setShowBanPrompt] = useState(false);
  const [showBanConfirm, setShowBanConfirm] = useState(false);
  const [banReason, setBanReason] = useState('');

  // Live state für Votes
  const [upvotes, setUpvotes] = useState(submission.upvotes);
  const [downvotes, setDownvotes] = useState(submission.downvotes);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [isVoting, setIsVoting] = useState(false);

  // Animation states
  const [voteAnimation, setVoteAnimation] = useState<'upvote' | 'downvote' | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Update wenn submission sich ändert
  useEffect(() => {
    setUpvotes(submission.upvotes);
    setDownvotes(submission.downvotes);
    setUserVote(initialUserVote);
  }, [submission.upvotes, submission.downvotes, initialUserVote]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const handleVoteClick = async (voteType: 'upvote' | 'downvote') => {
    if (isVoting) return;

    setIsVoting(true);
    setVoteAnimation(voteType);

    // Optimistic update
    const wasUpvote = userVote === 'upvote';
    const wasDownvote = userVote === 'downvote';

    // Update local state immediately
    if (voteType === 'upvote') {
      if (wasUpvote) {
        setUpvotes(prev => prev - 1);
        setUserVote(null);
      } else {
        setUpvotes(prev => prev + 1);
        if (wasDownvote) setDownvotes(prev => prev - 1);
        setUserVote('upvote');
      }
    } else {
      if (wasDownvote) {
        setDownvotes(prev => prev - 1);
        setUserVote(null);
      } else {
        setDownvotes(prev => prev + 1);
        if (wasUpvote) setUpvotes(prev => prev - 1);
        setUserVote('downvote');
      }
    }

    try {
      await onVote(submission.id, voteType);
    } catch {
      // Revert on error
      setUpvotes(submission.upvotes);
      setDownvotes(submission.downvotes);
      setUserVote(initialUserVote);
    } finally {
      setIsVoting(false);
      setTimeout(() => setVoteAnimation(null), 300);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;

    setIsSubmittingReport(true);
    const success = await onReport(submission.id, reportReason);
    setIsSubmittingReport(false);

    if (success) {
      setShowReportDialog(false);
      setReportReason('');
      setShowMenu(false);
    }
  };

  const handleModerate = async (action: 'delete' | 'ban') => {
    if (action === 'ban') {
      setShowMenu(false);
      setShowBanPrompt(true);
    } else {
      setShowMenu(false);
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    await onModerate(submission.id, 'delete');
  };

  const handleBanReasonSubmit = (reason: string) => {
    setBanReason(reason);
    setShowBanPrompt(false);
    setShowBanConfirm(true);
  };

  const confirmBan = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    await onModerate(submission.id, 'ban', banReason);
  };

  if (isDeleting) {
    return (
      <div className="animate-out slide-out-to-right-full fade-out duration-300">
        <div className="relative group bg-white/60 dark:bg-[#2a2520]/60 backdrop-blur-md border border-red-500/30 dark:border-red-400/30 rounded-2xl p-6 shadow-sm opacity-50">
          <div className="text-center text-red-600 dark:text-red-400">
            Wird gelöscht...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group bg-white/60 dark:bg-[#2a2520]/60 backdrop-blur-md border border-[#d97757]/10 dark:border-[#e89a7a]/10 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-[#d97757]/20 dark:hover:border-[#e89a7a]/20 transition-all duration-300">
      {/* Menu Button */}
      <div className="absolute top-4 right-4" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 rounded-lg hover:bg-[#d97757]/10 dark:hover:bg-[#e89a7a]/10 transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Menü öffnen"
        >
          <MoreVertical className="h-5 w-5 text-[#6b635a] dark:text-[#b8aea5]" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#2a2520] rounded-xl shadow-2xl border border-[#d97757]/20 dark:border-[#e89a7a]/20 py-2 z-20 animate-in slide-in-from-top-2 fade-in duration-200">
            {isModerator ? (
              <>
                <button
                  onClick={() => handleModerate('delete')}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#d97757]/10 dark:hover:bg-[#e89a7a]/10 text-[#2a2520] dark:text-[#f5f1ed] transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Löschen</span>
                </button>
                <button
                  onClick={() => handleModerate('ban')}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors"
                >
                  <Ban className="h-4 w-4" />
                  <span className="text-sm font-medium">User bannen</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowReportDialog(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#d97757]/10 dark:hover:bg-[#e89a7a]/10 text-[#2a2520] dark:text-[#f5f1ed] transition-colors"
              >
                <Flag className="h-4 w-4" />
                <span className="text-sm font-medium">Melden</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Category Badge */}
      <div className="mb-3">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#7a9b88]/10 dark:bg-[#8faf9d]/10 text-[#7a9b88] dark:text-[#8faf9d] border border-[#7a9b88]/20 dark:border-[#8faf9d]/20">
          {submission.category}
        </span>
      </div>

      {/* Author and Date */}
      <div className="mb-3 flex items-center gap-2 text-xs text-[#6b635a] dark:text-[#b8aea5]">
        <span className="font-medium text-[#2a2520] dark:text-[#f5f1ed]">
          {submission.author}
        </span>
        <span>•</span>
        <span>{new Date(submission.created_at).toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</span>
      </div>

      {/* Content */}
      <p className="text-[#2a2520] dark:text-[#f5f1ed] mb-4 whitespace-pre-wrap leading-relaxed">
        {submission.text}
      </p>

      {/* Meta Info - nur wenn Name oder Telefon vorhanden */}
      {(submission.name || submission.phone) && (
        <div className="text-sm text-[#6b635a] dark:text-[#b8aea5] mb-4 pb-4 border-b border-[#d97757]/10 dark:border-[#e89a7a]/10">
          {submission.name && <span className="font-medium">{submission.name}</span>}
          {submission.name && submission.phone && <span className="mx-2">•</span>}
          {submission.phone && <span>{submission.phone}</span>}
        </div>
      )}

      {!submission.name && !submission.phone && (
        <div className="mb-4 pb-4 border-b border-[#d97757]/10 dark:border-[#e89a7a]/10"></div>
      )}

      {/* Voting */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleVoteClick('upvote')}
          disabled={isVoting}
          className={`group/upvote flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
            userVote === 'upvote'
              ? 'bg-[#7a9b88] dark:bg-[#8faf9d] text-white shadow-lg shadow-[#7a9b88]/30 dark:shadow-[#8faf9d]/30 scale-105'
              : 'bg-[#7a9b88]/10 dark:bg-[#8faf9d]/10 text-[#7a9b88] dark:text-[#8faf9d] hover:bg-[#7a9b88]/20 dark:hover:bg-[#8faf9d]/20 hover:scale-105'
          } ${isVoting ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} ${
            voteAnimation === 'upvote' ? 'animate-in zoom-in-50 duration-200' : ''
          }`}
        >
          <ThumbsUp className="h-4 w-4 group-hover/upvote:scale-110 transition-transform" />
          <span className="font-bold text-base min-w-[2ch] text-center">{upvotes}</span>
        </button>

        <button
          onClick={() => handleVoteClick('downvote')}
          disabled={isVoting}
          className={`group/downvote flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
            userVote === 'downvote'
              ? 'bg-[#d97757] dark:bg-[#e89a7a] text-white shadow-lg shadow-[#d97757]/30 dark:shadow-[#e89a7a]/30 scale-105'
              : 'bg-[#d97757]/10 dark:bg-[#e89a7a]/10 text-[#d97757] dark:text-[#e89a7a] hover:bg-[#d97757]/20 dark:hover:bg-[#e89a7a]/20 hover:scale-105'
          } ${isVoting ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} ${
            voteAnimation === 'downvote' ? 'animate-in zoom-in-50 duration-200' : ''
          }`}
        >
          <ThumbsDown className="h-4 w-4 group-hover/downvote:scale-110 transition-transform" />
          <span className="font-bold text-base min-w-[2ch] text-center">{downvotes}</span>
        </button>
      </div>

      {/* Report Dialog */}
      {showReportDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#2a2520] rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#2a2520] dark:text-[#f5f1ed]">
                Beitrag melden
              </h3>
              <button
                onClick={() => {
                  setShowReportDialog(false);
                  setReportReason('');
                }}
                className="p-2 rounded-lg hover:bg-[#6b635a]/10 transition-colors"
              >
                <X className="h-5 w-5 text-[#6b635a] dark:text-[#b8aea5]" />
              </button>
            </div>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Warum möchtest du diesen Beitrag melden?"
              className="w-full px-4 py-3 rounded-xl border border-[#d97757]/20 dark:border-[#e89a7a]/20 bg-white/50 dark:bg-[#1a1714]/50 text-[#2a2520] dark:text-[#f5f1ed] placeholder-[#6b635a] dark:placeholder-[#b8aea5] focus:outline-none focus:ring-2 focus:ring-[#d97757] dark:focus:ring-[#e89a7a] resize-none transition-all"
              rows={4}
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowReportDialog(false);
                  setReportReason('');
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#6b635a]/10 dark:bg-[#b8aea5]/10 text-[#2a2520] dark:text-[#f5f1ed] hover:bg-[#6b635a]/20 dark:hover:bg-[#b8aea7]/20 transition-all"
              >
                Abbrechen
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason.trim() || isSubmittingReport}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#d97757] dark:bg-[#e89a7a] text-white hover:bg-[#c26845] dark:hover:bg-[#d68868] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#d97757]/30 dark:shadow-[#e89a7a]/30"
              >
                {isSubmittingReport ? 'Wird gemeldet...' : 'Melden'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog for Deletion */}
      {showDeleteConfirm && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          title="Beitrag löschen"
          message="Möchtest du diesen Beitrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
          confirmText="Löschen"
          cancelText="Abbrechen"
          variant="danger"
        />
      )}

      {/* Ban Prompt Dialog */}
      {showBanPrompt && (
        <PromptDialog
          isOpen={showBanPrompt}
          onClose={() => setShowBanPrompt(false)}
          onConfirm={handleBanReasonSubmit}
          title="User bannen"
          message="Bitte gib einen Grund für den Ban ein:"
          placeholder="Grund für den Ban..."
          confirmText="Weiter"
          cancelText="Abbrechen"
        />
      )}

      {/* Confirm Dialog for Ban Action */}
      {showBanConfirm && (
        <ConfirmDialog
          isOpen={showBanConfirm}
          onClose={() => {
            setShowBanConfirm(false);
            setBanReason('');
          }}
          onConfirm={confirmBan}
          title="User bannen bestätigen"
          message={`Möchtest du diesen User wirklich bannen?${banReason ? `\n\nGrund: ${banReason}` : ''}`}
          confirmText="Bannen"
          cancelText="Abbrechen"
          variant="danger"
        />
      )}

      {/* Comment Section */}
      <CommentSection
        submissionId={submission.id}
        currentUserId={currentUserId}
        isModerator={isModerator}
      />
    </div>
  );
}
