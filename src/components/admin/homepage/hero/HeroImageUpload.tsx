"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type HeroImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
};

const MAX_SOURCE_SIZE = 25 * 1024 * 1024;
const MAX_OUTPUT_SIZE = 5 * 1024 * 1024;
const MAX_WIDTH = 1920;

export default function HeroImageUpload({
  value,
  onChange,
}: HeroImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  async function processFile(file: File) {
    setError("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload a JPEG, PNG or WebP image.");
      return;
    }

    if (file.size > MAX_SOURCE_SIZE) {
      setError("The source image must be 25 MB or smaller.");
      return;
    }

    try {
      setUploading(true);

      const optimizedFile = await optimizeImage(file);

      if (optimizedFile.size > MAX_OUTPUT_SIZE) {
        throw new Error(
          "The optimized image is still larger than 5 MB. Please choose a smaller image."
        );
      }

      const supabase = createClient();

      const fileName = `${Date.now()}-${crypto.randomUUID()}.webp`;

      const storagePath = `homepage/hero/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(storagePath, optimizedFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: "image/webp",
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(storagePath);

      if (!data.publicUrl) {
        throw new Error("Unable to generate the image URL.");
      }

      onChange(data.publicUrl);
    } catch (err) {
      console.error("Hero image upload error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload the image."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      void processFile(file);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      void processFile(file);
    }
  }

  return (
    <div className="space-y-4">
      {value ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
          <div className="relative aspect-[16/7]">
            <img
              src={value}
              alt="Hero preview"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            <button
              type="button"
              disabled={uploading}
              onClick={() => onChange("")}
              className="
                absolute
                right-4
                top-4
                inline-flex
                items-center
                gap-2
                rounded-lg
                bg-black/70
                px-3
                py-2
                text-xs
                font-medium
                text-white
                backdrop-blur-sm
                transition
                hover:bg-black
              "
            >
              <X className="h-4 w-4" />
              Remove Image
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Hero background image
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Recommended: landscape image, at least 1920 × 1080.
              </p>
            </div>

            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}

              Replace Image
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className={`
            flex
            min-h-[260px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            border-2
            border-dashed
            p-8
            text-center
            transition

            ${
              dragging
                ? "border-green-500 bg-green-50"
                : "border-gray-300 bg-gray-50"
            }
          `}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-green-700" />
            ) : (
              <ImageIcon className="h-5 w-5 text-green-700" />
            )}
          </div>

          <h3 className="mt-4 text-sm font-semibold text-gray-900">
            {uploading ? "Uploading image..." : "Upload hero image"}
          </h3>

          <p className="mt-2 max-w-sm text-xs leading-5 text-gray-500">
            Drag and drop an image here, or select one from your computer.
            JPEG, PNG and WebP are supported.
          </p>

          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[#073f30]
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-[#0a503d]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Upload className="h-4 w-4" />
            Choose Image
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInput}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

async function optimizeImage(file: File): Promise<File> {
  const image = await loadImage(file);

  const ratio = Math.min(1, MAX_WIDTH / image.width);

  const width = Math.round(image.width * ratio);
  const height = Math.round(image.height * ratio);

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to process this image.");
  }

  context.drawImage(image, 0, 0, width, height);

  let quality = 0.88;
  let blob = await canvasToBlob(canvas, quality);

  while (blob.size > MAX_OUTPUT_SIZE && quality > 0.5) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, quality);
  }

  return new File(
    [blob],
    `${file.name.replace(/\.[^.]+$/, "")}.webp`,
    {
      type: "image/webp",
    }
  );
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to read the selected image."));
    };

    image.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Unable to optimize the image."));
        }
      },
      "image/webp",
      quality
    );
  });
}