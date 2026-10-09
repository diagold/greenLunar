"use client";

import {
  ChangeEvent,
  useRef,
  useState,
} from "react";

import {
  ImagePlus,
  Loader2,
  Upload,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

const MAX_SOURCE_SIZE = 25 * 1024 * 1024;
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const MAX_WIDTH = 2200;

async function optimizeImage(file: File) {
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(
    1,
    MAX_WIDTH / bitmap.width
  );

  const width = Math.round(
    bitmap.width * scale
  );

  const height = Math.round(
    bitmap.height * scale
  );

  const canvas =
    document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context =
    canvas.getContext("2d");

  if (!context) {
    bitmap.close();

    throw new Error(
      "Unable to process image."
    );
  }

  context.drawImage(
    bitmap,
    0,
    0,
    width,
    height
  );

  bitmap.close();

  let quality = 0.9;
  let blob: Blob | null = null;

  while (quality >= 0.5) {
    blob =
      await new Promise<Blob | null>(
        (resolve) => {
          canvas.toBlob(
            resolve,
            "image/webp",
            quality
          );
        }
      );

    if (
      blob &&
      blob.size <= MAX_UPLOAD_SIZE
    ) {
      break;
    }

    quality -= 0.1;
  }

  if (!blob) {
    throw new Error(
      "Unable to optimize image."
    );
  }

  if (blob.size > MAX_UPLOAD_SIZE) {
    throw new Error(
      "Optimized image is still larger than 5 MB."
    );
  }

  return blob;
}

export default function AboutHeroImageUpload({
  value,
  onChange,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleFile(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select an image file."
      );

      return;
    }

    if (file.size > MAX_SOURCE_SIZE) {
      setError(
        "The source image must be 25 MB or smaller."
      );

      return;
    }

    setUploading(true);

    try {
      const optimized =
        await optimizeImage(file);

      const supabase = createClient();

      const filename =
        `${crypto.randomUUID()}.webp`;

      const path =
        `about/hero/${filename}`;

      const { error: uploadError } =
        await supabase.storage
          .from("product-images")
          .upload(
            path,
            optimized,
            {
              contentType: "image/webp",
              upsert: false,
            }
          );

      if (uploadError) {
        throw uploadError;
      }

      const { data } =
        supabase.storage
          .from("product-images")
          .getPublicUrl(path);

      onChange(data.publicUrl);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload image."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      <div className="relative min-h-[240px] overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
        {value ? (
          <>
            <img
              src={value}
              alt="About hero preview"
              className="h-[240px] w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/25" />
          </>
        ) : (
          <div className="flex h-[240px] items-center justify-center">
            <div className="text-center text-gray-400">
              <ImagePlus
                size={34}
                className="mx-auto"
              />

              <p className="mt-2 text-sm">
                No hero image
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={uploading}
        onClick={() =>
          inputRef.current?.click()
        }
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2
              size={17}
              className="animate-spin"
            />

            Uploading...
          </>
        ) : (
          <>
            <Upload size={17} />

            {value
              ? "Change Hero Image"
              : "Upload Hero Image"}
          </>
        )}
      </button>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}