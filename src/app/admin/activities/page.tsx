"use client";

import { DeleteDialog } from "@/components/delete-dialog";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";
import { ArrowLeft, Award, Edit, Loader2, Mic, Plus, Star, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const typeIcons = {
  SPEAKER: Mic,
  MENTOR: Users,
  AWARD: Award,
  OSS: Star,
};

const typeLabels = {
  SPEAKER: "Speaker",
  MENTOR: "Mentor",
  AWARD: "Award",
  OSS: "Open Source",
};

export default function ActivitiesListPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  const { data: activities, isLoading, refetch } = trpc.content.listActivities.useQuery();

  const deleteActivity = trpc.content.deleteActivity.useMutation({
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
      deleteActivity.mutate({ id: deleteId });
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
            <h1 className="text-3xl font-bold text-slate-900">Activities</h1>
          </div>
          <Link href="/admin/activities/new">
            <Button>
              <Plus className="h-4 w-4" /> Add Activity
            </Button>
          </Link>
        </div>

        {!activities || activities.length === 0 ? (
          <Card>
            <p className="text-center text-slate-600">No activities yet. Add your first one!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = typeIcons[activity.type as keyof typeof typeIcons];
              return (
                <Card key={activity.id} className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50">
                        <Icon className="h-5 w-5 text-rose-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{activity.title}</h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {typeLabels[activity.type as keyof typeof typeLabels]} · {formatDate(activity.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Link
                        href={`/admin/activities/${activity.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(activity.id, activity.title)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />

      <DeleteDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Activity"
        description={`Are you sure you want to delete "${deleteTitle}"? This action cannot be undone.`}
        isDeleting={deleteActivity.isPending}
      />
    </div>
  );
}
