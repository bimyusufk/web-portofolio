"use client";

import { DeleteDialog } from "@/components/delete-dialog";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";
import { ArrowLeft, Edit, Eye, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ResearchListPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  const { data: papers, isLoading, refetch } = trpc.content.listResearch.useQuery();

  const deleteResearch = trpc.content.deleteResearch.useMutation({
    onSuccess: () => {
      setDeleteId(null);
      refetch();
    },
  });

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteId(id);
    setDeleteTitle(title);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteResearch.mutate({ id: deleteId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface/60">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface/60">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <Link
          href="/admin/content"
          className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 hover:text-rose-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Content
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rose-700">Admin</p>
            <h1 className="text-3xl font-bold text-slate-900">Research</h1>
          </div>
          <Link href="/admin/content/research/new">
            <Button>New Paper</Button>
          </Link>
        </div>

        {!papers || papers.length === 0 ? (
          <Card>
            <p className="text-center text-slate-600">No research papers yet. Create your first one!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {papers.map((paper) => (
              <Card key={paper.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{paper.title}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${
                          paper.status === "PUBLISHED"
                            ? "bg-accent/10 text-accent ring-accent/20"
                            : paper.status === "DRAFT"
                            ? "bg-slate-100 text-slate-600 ring-slate-200"
                            : paper.status === "REVIEW"
                            ? "bg-amber-50 text-amber-700 ring-amber-200"
                            : "bg-rose-50 text-rose-700 ring-rose-200"
                        }`}
                      >
                        {paper.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{paper.authors.join(", ")}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {paper.venue && `${paper.venue} · `}
                      {paper.year} · Updated {new Date(paper.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/research/${paper.slug}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/content/research/${paper.id}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(paper.id, paper.title)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />

      <DeleteDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Research Paper"
        description={`Are you sure you want to delete "${deleteTitle}"? This action cannot be undone.`}
        isDeleting={deleteResearch.isPending}
      />
    </div>
  );
}
