"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { ArrowLeft, Plus, Link2, ArrowRight, ArrowLeft as ArrowLeftIcon } from "lucide-react";
import {
  getRelationsByEntryId,
  getIncomingRelationsByEntryId,
  getAllRelationsByEntryId,
} from "@/components/content-relations/types";
import { dummyEntries } from "@/components/workflow-management/types";
import { RelationList } from "@/components/content-relations/relation-list";
import { RelationForm } from "@/components/content-relations/relation-form";
import { StatusBadge } from "@/components/workflow-management/status-badge";
import { getRelationTypeLabel } from "@/components/content-relations/types";

export default function EntryRelationsPage() {
  const params = useParams();
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const entryId = params?.entryId
    ? parseInt(Array.isArray(params.entryId) ? params.entryId[0] : params.entryId)
    : null;

  const entry = entryId ? dummyEntries.find((e) => e.id === entryId) : null;
  const outgoingRelations = entryId ? getRelationsByEntryId(entryId) : [];
  const incomingRelations = entryId ? getIncomingRelationsByEntryId(entryId) : [];

  const handleCreateRelation = (data: {
    fromContentId: number;
    toContentId: number;
    relationType: string;
  }) => {
    console.log("Create relation:", data);
    // In real app, this would call API: POST /content/:from_content_id/relations
    setShowCreateModal(false);
    alert(`Relation created: ${data.fromContentId} → ${data.toContentId} (${data.relationType})`);
  };

  const handleDeleteRelation = (relationId: number) => {
    if (confirm("Are you sure you want to delete this relation?")) {
      console.log("Delete relation:", relationId);
      // In real app, this would call API: DELETE /content/relations/:relation_id
    }
  };

  if (!entry) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/content-relations")}
            className="hover:bg-[var(--card-bg)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">
              Entry Not Found
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              This entry does not exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/content-relations")}
            className="hover:bg-[var(--card-bg)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] transition-colors">
              Content Relations
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] transition-colors mt-1">
              Manage relations for: {entry.title}
            </p>
          </div>
        </div>
        <Button
          className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--button-text)] flex items-center gap-2 transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4" />
          Create Relation
        </Button>
      </div>

      {/* Entry Info Card */}
      <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">
              {entry.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
              <span>{entry.contentType.name}</span>
              <StatusBadge status={entry.status} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-[var(--muted-foreground)]">Entry ID</p>
            <p className="text-lg font-semibold text-[var(--foreground)]">#{entry.id}</p>
          </div>
        </div>
      </Card>

      {/* Relations Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-[var(--card-bg)] border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Outgoing Relations</p>
              <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
                {outgoingRelations.length}
              </p>
            </div>
            <ArrowRight className="w-8 h-8 text-[var(--primary)] opacity-60" />
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-2">
            Relations from this entry to others
          </p>
        </Card>

        <Card className="p-4 bg-[var(--card-bg)] border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Incoming Relations</p>
              <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
                {incomingRelations.length}
              </p>
            </div>
            <ArrowLeftIcon className="w-8 h-8 text-[var(--primary)] opacity-60" />
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-2">
            Relations from other entries to this one
          </p>
        </Card>
      </div>

      {/* Outgoing Relations */}
      <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Outgoing Relations
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Relations from this entry to other entries
            </p>
          </div>
        </div>
        {outgoingRelations.length > 0 ? (
          <RelationList
            relations={outgoingRelations}
            onDelete={handleDeleteRelation}
            showActions={true}
          />
        ) : (
          <div className="text-center py-8 text-[var(--muted-foreground)]">
            <Link2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No outgoing relations</p>
            <p className="text-xs mt-1">Create a relation to connect this entry to others</p>
          </div>
        )}
      </Card>

      {/* Incoming Relations */}
      <Card className="p-6 bg-[var(--card-bg-inner)] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
              <ArrowLeftIcon className="h-5 w-5" />
              Incoming Relations
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Relations from other entries to this one
            </p>
          </div>
        </div>
        {incomingRelations.length > 0 ? (
          <RelationList
            relations={incomingRelations}
            onDelete={handleDeleteRelation}
            showActions={true}
          />
        ) : (
          <div className="text-center py-8 text-[var(--muted-foreground)]">
            <Link2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No incoming relations</p>
            <p className="text-xs mt-1">Other entries can create relations to this entry</p>
          </div>
        )}
      </Card>

      {/* Create Relation Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Relation"
          size="lg"
        >
          <RelationForm
            fromContentId={entry.id}
            onSubmit={handleCreateRelation}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}

