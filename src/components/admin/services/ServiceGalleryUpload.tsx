"use client";

import {
  ChangeEvent,
  useRef,
  useState,
} from "react";

import {
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import type {
  ServiceGalleryItem,
} from "@/types/service";

type Props = {
  slug: string;
  items: ServiceGalleryItem[];
  onChange: (
    items: ServiceGalleryItem[]
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

export default function ServiceGalleryUpload({
  slug,
  items,
  onChange,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function uploadFiles(
    files: File[]
  ) {
    setError("");

    const invalidFile =
      files.find(
        (file) =>
          !acceptedTypes.includes(
            file.type
          ) ||
          file.size >
            MAX_SOURCE_SIZE
      );

    if (invalidFile) {
      setError(
        "Gallery images must be JPEG, PNG or WebP and no larger than 25 MB each."
      );

      return;
    }

    setUploading(true);

    try {
      const supabase =
        createClient();

      const uploadedItems:
        ServiceGalleryItem[] =
        [];

      for (
        let index = 0;
        index < files.length;
        index++
      ) {
        const file =
          files[index];

        const blob =
          await optimiseImage(
            file
          );

        const path =
          `services/${safeSlug(
            slug
          )}/gallery/${Date.now()}-${index}.webp`;

        const {
          error:
            uploadError,
        } = await supabase.storage
          .from(
            "product-images"
          )
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
          .from(
            "product-images"
          )
          .getPublicUrl(path);

        uploadedItems.push({
          url:
            publicData.publicUrl,

          alt:
            file.name
              .replace(
                /\.[^/.]+$/,
                ""
              )
              .replace(
                /[-_]+/g,
                " "
              ),
        });
      }

      onChange([
        ...items,
        ...uploadedItems,
      ]);
    } catch (
      uploadError
    ) {
      console.error(
        "Service gallery upload error:",
        uploadError
      );

      setError(
        uploadError instanceof
          Error
          ? uploadError.message
          : "Unable to upload gallery images."
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

  function handleFiles(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files =
      Array.from(
        event.target.files ??
          []
      );

    if (files.length) {
      void uploadFiles(
        files
      );
    }
  }

  function updateAlt(
    index: number,
    value: string
  ) {
    const updated =
      [...items];

    updated[index] = {
      ...updated[index],
      alt: value,
    };

    onChange(updated);
  }

  function removeItem(
    index: number
  ) {
    onChange(
      items.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Service Gallery
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add supporting images for the public service page.
          </p>
        </div>

        <button
          type="button"
          disabled={uploading}
          onClick={() =>
            inputRef.current?.click()
          }
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-semibold text-[#073f30] transition hover:bg-green-100 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2
              size={16}
              className="animate-spin"
            />
          ) : (
            <Upload
              size={16}
            />
          )}

          {uploading
            ? "Uploading..."
            : "Add Images"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFiles}
        className="hidden"
      />

      {items.length === 0 ? (
        <div className="mt-6 flex min-h-[180px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 text-center">
          <ImagePlus
            size={25}
            className="text-[#073f30]"
          />

          <p className="mt-3 text-sm font-semibold text-gray-700">
            No gallery images
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Upload multiple images to create the service gallery.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map(
            (item, index) => (
              <div
                key={`${item.url}-${index}`}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <div className="relative aspect-[16/10] bg-gray-100">
                  <img
                    src={
                      item.url
                    }
                    alt={
                      item.alt ||
                      ""
                    }
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(
                        index
                      )
                    }
                    title="Remove image"
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white transition hover:bg-red-600"
                  >
                    <Trash2
                      size={15}
                    />
                  </button>
                </div>

                <div className="p-3">
                  <label className="mb-2 block text-xs font-semibold text-gray-500">
                    Alt Text
                  </label>

                  <input
                    type="text"
                    value={
                      item.alt
                    }
                    onChange={(
                      event
                    ) =>
                      updateAlt(
                        index,
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="Describe the image"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#073f30] focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>
            )
          )}
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}