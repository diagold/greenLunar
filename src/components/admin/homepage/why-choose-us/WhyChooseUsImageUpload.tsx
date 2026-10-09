"use client";

import { ChangeEvent, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

const MAX_SOURCE_SIZE = 25 * 1024 * 1024;
const MAX_WIDTH = 1920;
const TARGET_SIZE = 5 * 1024 * 1024;

async function optimizeImage(file: File): Promise<Blob> {
  const image = document.createElement("img");

  const imageUrl = URL.createObjectURL(file);

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Unable to load image."));
      image.src = imageUrl;
    });

    const scale = Math.min(1, MAX_WIDTH / image.width);

    const width = Math.round(image.width * scale);
    const height = Math.round(image.height * scale);

    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Unable to process image.");
    }

    context.drawImage(image, 0, 0, width, height);

    let quality = 0.88;
    let blob: Blob | null = null;

    while (quality >= 0.5) {
      blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/webp", quality);
      });

      if (blob && blob.size <= TARGET_SIZE) {
        break;
      }

      quality -= 0.08;
    }

    if (!blob) {
      throw new Error("Unable to optimize image.");
    }

    return blob;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export default function WhyChooseUsImageUpload({
  value,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function uploadFile(file: File) {
    setErrorMessage("");

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select an image file.");
      return;
    }

    if (file.size > MAX_SOURCE_SIZE) {
      setErrorMessage(
        "The original image must be smaller than 25 MB."
      );
      return;
    }

    setUploading(true);

    try {
      const optimized = await optimizeImage(file);

      if (optimized.size > TARGET_SIZE) {
        throw new Error(
          "The optimized image is still larger than 5 MB."
        );
      }

      const supabase = createClient();

      const fileName = `homepage/why-choose-us/${Date.now()}-${crypto.randomUUID()}.webp`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, optimized, {
          contentType: "image/webp",
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      onChange(data.publicUrl);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to upload image."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    await uploadFile(file);

    event.target.value = "";
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
          <img
            src={value}
            alt="Why Choose Us"
            className="h-72 w-full object-cover sm:h-96"
          />

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow"
            >
              <Upload size={16} />
              Replace
            </button>

            <button
              type="button"
              disabled={uploading}
              onClick={() => onChange("")}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 text-center transition hover:border-green-300 hover:bg-green-50/30"
        >
          {uploading ? (
            <Loader2
              size={28}
              className="animate-spin text-green-700"
            />
          ) : (
            <ImagePlus size={30} className="text-gray-400" />
          )}

          <p className="mt-3 text-sm font-semibold text-gray-700">
            {uploading ? "Uploading image..." : "Upload section image"}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            JPEG, PNG or WebP. Maximum source size 25 MB.
          </p>
        </button>
      )}

      {errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}