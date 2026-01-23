"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";
import { Check, Image as ImageIcon, Loader2, Search, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type ImagePickerProps = {
  selectedImageId?: string | null;
  onSelect: (imageId: string | null, imageUrl: string | null) => void;
  label?: string;
  aspectRatio?: "square" | "video" | "auto";
};

export function ImagePicker({ selectedImageId, onSelect, label = "Thumbnail", aspectRatio = "auto" }: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);

  const { data: media, isLoading, refetch } = trpc.media.list.useQuery(undefined, {
    enabled: isOpen,
  });

  const selectedImage = media?.find((m) => m.id === selectedImageId);

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
      onSelect(mediaItem?.id ?? null, mediaItem?.url ?? null);
      setIsOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const filteredMedia = media?.filter((m) =>
    m.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "aspect-auto",
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      
      {selectedImage ? (
        <div className="relative group">
          <Image
            src={selectedImage.url}
            alt={selectedImage.altText || "Selected image"}
            width={300}
            height={aspectRatio === "square" ? 300 : aspectRatio === "video" ? 169 : 200}
            className={`rounded-xl border-2 border-rose-100 object-cover ${aspectClasses[aspectRatio]} w-full max-w-sm`}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 rounded-xl">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsOpen(true)}
              className="bg-white"
            >
              Change
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onSelect(null, null)}
              className="bg-white"
            >
              <X className="h-4 w-4" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-32 w-full max-w-sm items-center justify-center rounded-xl border-2 border-dashed border-rose-200 bg-rose-50/30 text-slate-500 hover:border-rose-300 hover:bg-rose-50/50 transition"
        >
          <div className="text-center">
            <ImageIcon className="mx-auto h-8 w-8 mb-2 text-rose-400" />
            <p className="text-sm font-medium">Select {label}</p>
          </div>
        </button>
      )}

      {/* Image Picker Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-rose-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Select {label}</h3>
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

            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                </div>
              ) : !filteredMedia || filteredMedia.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                  <ImageIcon className="h-12 w-12 mb-2 text-slate-300" />
                  <p>No images found</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {filteredMedia.map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => {
                        onSelect(image.id, image.url);
                        setIsOpen(false);
                      }}
                      className={`relative group rounded-lg overflow-hidden border-2 transition ${
                        selectedImageId === image.id
                          ? "border-rose-500 ring-2 ring-rose-200"
                          : "border-transparent hover:border-rose-200"
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || image.filename}
                        width={150}
                        height={150}
                        className="aspect-square object-cover w-full"
                      />
                      {selectedImageId === image.id && (
                        <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
                          <div className="bg-rose-500 rounded-full p-1">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
