"use client";

import {
  ChangeEvent,
  DragEvent,
  useRef,
  useState,
} from "react";

import {
  ImagePlus,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type ServiceImageUploadProps = {
  value: string;
  slug: string;
  onChange: (
    imageUrl: string
  ) => void;
};

const MAX_SOURCE_SIZE =
  25 * 1024 * 1024;

const TARGET_SIZE =
  5 * 1024 * 1024;

const MAX_DIMENSION = 1920;

const acceptedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

async function optimiseImage(
  file: File
): Promise<Blob> {
  const image =
    await createImageBitmap(file);

  let width = image.width;
  let height = image.height;

  if (
    width > MAX_DIMENSION ||
    height > MAX_DIMENSION
  ) {
    const ratio = Math.min(
      MAX_DIMENSION / width,
      MAX_DIMENSION / height
    );

    width = Math.round(
      width * ratio
    );

    height = Math.round(
      height * ratio
    );
  }

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = width;
  canvas.height = height;

  const context =
    canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Unable to process image."
    );
  }

  context.drawImage(
    image,
    0,
    0,
    width,
    height
  );

  image.close();

  let quality = 0.85;

  let blob: Blob | null =
    await new Promise(
      (resolve) =>
        canvas.toBlob(
          resolve,
          "image/webp",
          quality
        )
    );

  while (
    blob &&
    blob.size > TARGET_SIZE &&
    quality > 0.45
  ) {
    quality -= 0.1;

    blob =
      await new Promise(
        (resolve) =>
          canvas.toBlob(
            resolve,
            "image/webp",
            quality
          )
      );
  }

  if (!blob) {
    throw new Error(
      "Unable to optimise image."
    );
  }

  return blob;
}

function safeSlug(
  value: string
) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      ) || "service"
  );
}

export default function ServiceImageUpload({
  value,
  slug,
  onChange,
}: ServiceImageUploadProps) {
  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [uploading, setUploading] =
    useState(false);

  const [dragging, setDragging] =
    useState(false);

  const [error, setError] =
    useState("");

  async function uploadFile(
    file: File
  ) {
    setError("");

    if (
      !acceptedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Please upload a JPEG, PNG or WebP image."
      );

      return;
    }

    if (
      file.size >
      MAX_SOURCE_SIZE
    ) {
      setError(
        "The source image must be 25 MB or smaller."
      );

      return;
    }

    setUploading(true);

    try {
      const blob =
        await optimiseImage(
          file
        );

      const supabase =
        createClient();

      const path =
        `services/${safeSlug(
          slug
        )}/${Date.now()}.webp`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("product-images")
        .upload(
          path,
          blob,
          {
            contentType:
              "image/webp",

            cacheControl:
              "3600",

            upsert: false,
          }
        );

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: publicData,
      } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);

      if (
        !publicData.publicUrl
      ) {
        throw new Error(
          "Unable to generate the image URL."
        );
      }

      onChange(
        publicData.publicUrl
      );
    } catch (
      uploadError
    ) {
      console.error(
        "Service image upload error:",
        uploadError
      );

      setError(
        uploadError instanceof
          Error
          ? uploadError.message
          : "Unable to upload image."
      );
    } finally {
      setUploading(false);

      if (
        inputRef.current
      ) {
        inputRef.current.value =
          "";
      }
    }
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (file) {
      void uploadFile(file);
    }
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    setDragging(false);

    const file =
      event.dataTransfer
        .files?.[0];

    if (file) {
      void uploadFile(file);
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Main Service Image
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          This image can be used as the service hero image and listing thumbnail.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={
          handleFileChange
        }
        className="hidden"
      />

      {value ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
          <div className="relative aspect-[16/7] bg-gray-100">
            <img
              src={value}
              alt="Service preview"
              className="h-full w-full object-cover"
            />

            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                <Loader2
                  size={26}
                  className="animate-spin"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4">
            <p className="text-xs text-gray-400">
              JPEG, PNG or WebP. Images are optimised before upload.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={
                  uploading
                }
                onClick={() =>
                  inputRef.current?.click()
                }
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                />

                Replace
              </button>

              <button
                type="button"
                disabled={
                  uploading
                }
                onClick={() =>
                  onChange("")
                }
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
              >
                <Trash2
                  size={15}
                />

                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(
            event
          ) => {
            event.preventDefault();

            setDragging(true);
          }}
          onDragLeave={() =>
            setDragging(false)
          }
          onDrop={handleDrop}
          className={`
            mt-6
            flex
            min-h-[220px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            border-2
            border-dashed
            px-6
            text-center
            transition
            ${
              dragging
                ? "border-[#073f30] bg-green-50"
                : "border-gray-200 bg-gray-50"
            }
          `}
        >
          {uploading ? (
            <>
              <Loader2
                size={28}
                className="animate-spin text-[#073f30]"
              />

              <p className="mt-3 text-sm font-semibold text-gray-700">
                Optimising and uploading...
              </p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-[#073f30]">
                <ImagePlus
                  size={22}
                />
              </div>

              <p className="mt-4 text-sm font-semibold text-gray-800">
                Drag an image here
              </p>

              <p className="mt-1 text-xs text-gray-400">
                or select one from your computer
              </p>

              <button
                type="button"
                onClick={() =>
                  inputRef.current?.click()
                }
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#09543f]"
              >
                <Upload
                  size={16}
                />

                Choose Image
              </button>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}