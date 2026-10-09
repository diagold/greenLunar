"use client";

import {
  ChangeEvent,
  DragEvent,
  useRef,
  useState,
} from "react";

import {
  ImageIcon,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type ProductImageUploadProps = {
  value: string;
  slug: string;
  onChange: (url: string) => void;
};

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

const MAX_ORIGINAL_SIZE = 25 * 1024 * 1024;

const MAX_IMAGE_DIMENSION = 1920;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

async function optimizeImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    const objectUrl = URL.createObjectURL(file);

    image.onload = async () => {
      try {
        let width = image.width;
        let height = image.height;

        // Resize while maintaining aspect ratio
        if (
          width > MAX_IMAGE_DIMENSION ||
          height > MAX_IMAGE_DIMENSION
        ) {
          const scale = Math.min(
            MAX_IMAGE_DIMENSION / width,
            MAX_IMAGE_DIMENSION / height
          );

          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas =
          document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context =
          canvas.getContext("2d");

        if (!context) {
          throw new Error(
            "Unable to process the image."
          );
        }

        context.drawImage(
          image,
          0,
          0,
          width,
          height
        );

        let quality = 0.85;
        let blob: Blob | null = null;

        // Reduce WebP quality until comfortably
        // below Supabase's 5 MB limit.
        while (quality >= 0.45) {
          blob = await new Promise<Blob | null>(
            (resolveBlob) => {
              canvas.toBlob(
                resolveBlob,
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
            "Unable to compress the image."
          );
        }

        if (blob.size > MAX_UPLOAD_SIZE) {
          throw new Error(
            "The image could not be reduced below 5 MB. Please choose a smaller image."
          );
        }

        const originalName =
          file.name.replace(
            /\.[^/.]+$/,
            ""
          );

        const optimizedFile = new File(
          [blob],
          `${originalName}.webp`,
          {
            type: "image/webp",
            lastModified: Date.now(),
          }
        );

        resolve(optimizedFile);
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);

      reject(
        new Error(
          "Unable to read the selected image."
        )
      );
    };

    image.src = objectUrl;
  });
}

export default function ProductImageUpload({
  value,
  slug,
  onChange,
}: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  const [dragging, setDragging] =
    useState(false);

  const [error, setError] =
    useState("");

 async function uploadImage(file: File) {
  setError("");

  if (!ALLOWED_TYPES.includes(file.type)) {
    setError(
      "Please upload a JPG, PNG or WebP image."
    );
    return;
  }

  if (file.size > MAX_ORIGINAL_SIZE) {
    setError(
      "The original image is too large. Please select an image smaller than 25 MB."
    );
    return;
  }

  if (!slug.trim()) {
    setError(
      "Enter the product name before uploading an image."
    );
    return;
  }

  setUploading(true);

  try {
    // Optimize before sending anything to Supabase
    const optimizedFile =
      await optimizeImage(file);

    const supabase = createClient();

    const safeSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const fileName =
      `${Date.now()}.webp`;

    const filePath =
      `products/${safeSlug}/${fileName}`;

    const { error: uploadError } =
      await supabase.storage
        .from("product-images")
        .upload(
          filePath,
          optimizedFile,
          {
            cacheControl: "3600",
            upsert: false,
            contentType: "image/webp",
          }
        );

    if (uploadError) {
      console.error(
        "Product image upload error:",
        uploadError
      );

      throw new Error(
        uploadError.message
      );
    }

    const { data: publicUrlData } =
      supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

    if (!publicUrlData.publicUrl) {
      throw new Error(
        "Unable to generate image URL."
      );
    }

    onChange(
      publicUrlData.publicUrl
    );
  } catch (uploadError) {
    console.error(
      "Image processing/upload error:",
      uploadError
    );

    setError(
      uploadError instanceof Error
        ? uploadError.message
        : "Unable to process and upload image."
    );
  } finally {
    setUploading(false);
  }
}

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (file) {
      uploadImage(file);
    }

    // Allows selecting same file again
    event.target.value = "";
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    setDragging(false);

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      uploadImage(file);
    }
  }

  function handleRemove() {
    onChange("");
    setError("");
  }

  return (
    <div className="space-y-4">

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

          <div className="relative aspect-[16/9] bg-gray-50">

            <img
              src={value}
              alt="Product preview"
              className="h-full w-full object-cover"
            />

            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">

                <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700">
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Uploading...
                </div>

              </div>
            )}

          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 p-4">

            <div>
              <p className="text-sm font-semibold text-gray-700">
                Product image
              </p>

              <p className="mt-0.5 text-xs text-gray-400">
                JPG, PNG or WebP · Large images are automatically optimized
              </p>
            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                disabled={uploading}
                onClick={() =>
                  inputRef.current?.click()
                }
                className="
                  inline-flex items-center gap-2
                  rounded-lg border border-gray-200
                  px-3 py-2
                  text-xs font-semibold
                  text-gray-600
                  transition
                  hover:bg-gray-50
                  disabled:opacity-50
                "
              >
                <Upload size={15} />
                Replace
              </button>

              <button
                type="button"
                disabled={uploading}
                onClick={handleRemove}
                className="
                  inline-flex items-center gap-2
                  rounded-lg
                  border border-red-100
                  px-3 py-2
                  text-xs font-semibold
                  text-red-600
                  transition
                  hover:bg-red-50
                  disabled:opacity-50
                "
              >
                <Trash2 size={15} />
                Remove
              </button>

            </div>

          </div>

        </div>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() =>
            setDragging(false)
          }
          onDrop={handleDrop}
          className={`
            flex min-h-[240px]
            flex-col items-center
            justify-center
            rounded-2xl
            border-2 border-dashed
            px-6 py-10
            text-center
            transition-all

            ${
              dragging
                ? "border-[#073f30] bg-green-50"
                : "border-gray-200 bg-gray-50/50"
            }
          `}
        >

          {uploading ? (
            <>
              <Loader2
                size={32}
                className="animate-spin text-[#073f30]"
              />

              <p className="mt-4 text-sm font-semibold text-gray-700">
                Uploading image...
              </p>
            </>
          ) : (
            <>
              <div className="
                flex h-14 w-14
                items-center justify-center
                rounded-2xl bg-green-50
                text-[#073f30]
              ">
                <ImageIcon size={25} />
              </div>

              <p className="mt-4 font-semibold text-gray-800">
                Upload product image
              </p>

              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Drag and drop your image here,
                or select an image from your
                computer.
              </p>

              <button
                type="button"
                onClick={() =>
                  inputRef.current?.click()
                }
                className="
                  mt-5 inline-flex
                  items-center gap-2
                  rounded-xl bg-[#073f30]
                  px-4 py-2.5
                  text-sm font-semibold
                  text-white
                  transition
                  hover:bg-[#09543f]
                "
              >
                <Upload size={17} />
                Select Image
              </button>

              <p className="mt-3 text-xs text-gray-400">
                JPG, PNG or WebP · Maximum 5 MB
              </p>
            </>
          )}

        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

    </div>
  );
}