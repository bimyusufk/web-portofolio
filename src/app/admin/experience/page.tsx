"use client";

import { DeleteDialog } from "@/components/delete-dialog";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";
import { ArrowLeft, Edit, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ExperienceListPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  const { data: experiences, isLoading, refetch } = trpc.content.listExperience.useQuery();

  const deleteExperience = trpc.content.deleteExperience.useMutation({
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
      deleteExperience.mutate({ id: deleteId });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
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
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 hover:text-rose-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rose-700">Admin</p>
            <h1 className="text-3xl font-bold text-slate-900">Experience</h1>
          </div>
          <Link href="/admin/experience/new">
            <Button>
              <Plus className="h-4 w-4" /> Add Experience
            </Button>
          </Link>
        </div>

        {!experiences || experiences.length === 0 ? (
          <Card>
            <p className="text-center text-slate-600">No experience entries yet. Add your first one!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {experiences.map((exp) => (
              <Card key={exp.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{exp.role}</h3>
                    <p className="text-sm text-slate-600">{exp.company}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
                      {exp.location && ` · ${exp.location}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/admin/experience/${exp.id}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(exp.id, `${exp.role} at ${exp.company}`)}
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
        title="Delete Experience"
        description={`Are you sure you want to delete "${deleteTitle}"? This action cannot be undone.`}
        isDeleting={deleteExperience.isPending}
      />
    </div>
  );
}
