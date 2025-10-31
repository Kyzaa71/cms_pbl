"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { WorkflowComment, formatDateTime, getInitials } from "./types";
import { MessageSquare, Lock, Send } from "lucide-react";

interface WorkflowCommentsPanelProps {
  comments: WorkflowComment[];
  onAddComment: (comment: string, isPrivate: boolean) => void;
  includePrivate?: boolean;
  onTogglePrivate?: () => void;
}

export function WorkflowCommentsPanel({
  comments,
  onAddComment,
  includePrivate = false,
  onTogglePrivate,
}: WorkflowCommentsPanelProps) {
  const [newComment, setNewComment] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment(newComment.trim(), isPrivate);
    setNewComment("");
    setIsPrivate(false);
  };

  const displayedComments = includePrivate
    ? comments
    : comments.filter((c) => !c.isPrivate);

  return (
    <div className="space-y-6">
      {/* Add Comment Form */}
      <Card className="p-4 bg-[var(--card-bg)] border border-[var(--border)]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="comment" className="text-[var(--foreground)] font-medium">
              Add Comment
            </Label>
            <Textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
              rows={4}
              className="mt-2 resize-none border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="private"
                checked={isPrivate}
                onCheckedChange={(checked) => setIsPrivate(checked === true)}
              />
              <Label
                htmlFor="private"
                className="text-sm text-[var(--foreground)] cursor-pointer flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Private comment
              </Label>
            </div>

            <Button
              type="submit"
              disabled={!newComment.trim()}
              className="!font-medium !transition-all !duration-200 !ease-in-out !shadow-sm hover:!shadow-md active:!scale-95 !border-2 !min-w-[140px] !bg-[var(--primary)] hover:!bg-[var(--primary-hover)] active:!bg-[color-mix(in srgb, var(--primary) 90%, black)] !text-white !border-[var(--primary)] hover:!border-[var(--primary-hover)] disabled:!opacity-50 disabled:!cursor-not-allowed disabled:hover:!bg-[var(--primary)] disabled:hover:!shadow-sm disabled:active:!scale-100 !cursor-pointer"
            >
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </form>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments ({displayedComments.length})
          </h3>
          {onTogglePrivate && (
            <Button variant="outline" size="sm" onClick={onTogglePrivate}>
              {includePrivate ? "Hide Private" : "Show Private"}
            </Button>
          )}
        </div>

        {displayedComments.length === 0 ? (
          <div className="text-center py-8 text-[var(--muted-foreground)]">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-4">
            {displayedComments.map((comment) => (
              <Card
                key={comment.id}
                className="p-4 bg-[var(--card-bg)] border border-[var(--border)]"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="text-xs">
                      {getInitials(comment.user.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-[var(--foreground)]">
                          {comment.user.name}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {formatDateTime(comment.createdAt)}
                        </p>
                      </div>
                      {comment.isPrivate && (
                        <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                          <Lock className="h-3 w-3" />
                          Private
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-[var(--foreground)] whitespace-pre-wrap">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

