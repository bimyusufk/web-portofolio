"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";
import { GripVertical, Loader2, Plus, Search, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type GalleryManagerProps = {
  galleryImageIds: string[];
  onChange: (imageIds: string[]) => void;
  label?: string;
};

export function GalleryManager({ galleryImageIds, onChange, label = "Gallery" }: GalleryManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);

  const { data: media, isLoading, refetch } = trpc.media.list.useQuery(undefined, {
    enabled: isOpen,
  });

  const galleryImages = media?.filter((m) => galleryImageIds.includes(m.id)) || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      // API returns { file: media } — support both shapes
      const mediaItem = result?.file ?? result;
      await refetch();
      onChange([...galleryImageIds, mediaItem?.id]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddImage = (imageId: string) => {
    if (!galleryImageIds.includes(imageId)) {
      onChange([...galleryImageIds, imageId]);
    }
  };

  const handleRemoveImage = (imageId: string) => {
    onChange(galleryImageIds.filter((id) => id !== imageId));
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newOrder = [...galleryImageIds];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    onChange(newOrder);
  };

  const filteredMedia = media?.filter(
    (m) =>
      !galleryImageIds.includes(m.id) &&
      m.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>

      {/* Gallery Preview */}
      {galleryImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
          {galleryImages.map((image, index) => (
            <div key={image.id} className="relative group">
              <Image
                src={image.url}
                alt={image.altText || `Gallery image ${index + 1}`}
                width={200}
                height={200}
                className="aspect-square object-cover rounded-lg border-2 border-rose-100"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-rose-200 bg-rose-50/30 mb-3">
          <p className="text-sm text-slate-500">No images in gallery</p>
        </div>
      )}

      <Button type="button" variant="secondary" onClick={() => setIsOpen(true)} className="w-full">
        <Plus className="h-4 w-4" /> Add Images to {label}
      </Button>

      {/* Image Picker Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-rose-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Images to {label}</h3>
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-rose-100 bg-white/50 pl-10 pr-4 py-2 text-sm"
                  />
                </div>
                <label className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Button type="button" disabled={uploading} asChild>
                    <span className="cursor-pointer">
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Upload
                    </span>
                  </Button>
                </label>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-auto p-4" style={{ WebkitOverflowScrolling: 'touch' }}>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                </div>
              ) : !filteredMedia || filteredMedia.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                  <p>No more images available</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {filteredMedia.map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => handleAddImage(image.id)}
                      className="relative group rounded-lg overflow-hidden border-2 border-transparent hover:border-rose-200 transition"
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || image.filename}
                        width={150}
                        height={150}
                        className="aspect-square object-cover w-full"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 bg-rose-500 rounded-full p-2">
                          <Plus className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-rose-100">
              <Button onClick={() => setIsOpen(false)} className="w-full">
                Done
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
