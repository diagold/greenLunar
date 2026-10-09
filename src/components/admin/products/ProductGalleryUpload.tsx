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
  ProductGalleryItem,
} from "@/app/admin/(dashboard)/products/actions";

type Props = {
  slug: string;

  items: ProductGalleryItem[];

  onChange: (
    items: ProductGalleryItem[]
  ) => void;
};

const MAX_ORIGINAL_SIZE =
  25 * 1024 * 1024;

const MAX_UPLOAD_SIZE =
  5 * 1024 * 1024;

const MAX_DIMENSION = 1920;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

async function optimizeImage(
  file: File
): Promise<File> {
  return new Promise(
    (resolve, reject) => {
      const image = new Image();

      const objectUrl =
        URL.createObjectURL(file);

      image.onload = async () => {
        try {
          let width = image.width;
          let height = image.height;

          if (
            width > MAX_DIMENSION ||
            height > MAX_DIMENSION
          ) {
            const scale = Math.min(
              MAX_DIMENSION / width,
              MAX_DIMENSION / height
            );

            width =
              Math.round(width * scale);

            height =
              Math.round(height * scale);
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

          let quality = 0.85;
          let blob: Blob | null = null;

          while (quality >= 0.4) {
            blob =
              await new Promise<Blob | null>(
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
              blob.size <=
                MAX_UPLOAD_SIZE
            ) {
              break;
            }

            quality -= 0.1;
          }

          if (
            !blob ||
            blob.size >
              MAX_UPLOAD_SIZE
          ) {
            throw new Error(
              "Unable to reduce image below 5 MB."
            );
          }

          resolve(
            new File(
              [blob],
              `gallery-${Date.now()}.webp`,
              {
                type: "image/webp",
              }
            )
          );
        } catch (error) {
          reject(error);
        } finally {
          URL.revokeObjectURL(
            objectUrl
          );
        }
      };

      image.onerror = () => {
        URL.revokeObjectURL(
          objectUrl
        );

        reject(
          new Error(
            "Unable to read image."
          )
        );
      };

      image.src = objectUrl;
    }
  );
}

export default function ProductGalleryUpload({
  slug,
  items,
  onChange,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function uploadFiles(
    files: FileList
  ) {
    setError("");

    if (!slug.trim()) {
      setError(
        "Enter the product name before uploading gallery images."
      );

      return;
    }

    setUploading(true);

    try {
      const supabase =
        createClient();

      const newItems:
        ProductGalleryItem[] = [];

      for (
        let index = 0;
        index < files.length;
        index++
      ) {
        const file = files[index];

        if (
          !ALLOWED_TYPES.includes(
            file.type
          )
        ) {
          throw new Error(
            `${file.name} is not a supported image.`
          );
        }

        if (
          file.size >
          MAX_ORIGINAL_SIZE
        ) {
          throw new Error(
            `${file.name} is larger than 25 MB.`
          );
        }

        const optimized =
          await optimizeImage(file);

        const safeSlug = slug
          .toLowerCase()
          .trim()
          .replace(
            /[^a-z0-9-]/g,
            "-"
          )
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");

        const filePath =
          `products/${safeSlug}/gallery/${Date.now()}-${index}.webp`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from("product-images")
          .upload(
            filePath,
            optimized,
            {
              cacheControl:
                "3600",

              upsert: false,

              contentType:
                "image/webp",
            }
          );

        if (uploadError) {
          throw uploadError;
        }

        const { data } =
          supabase.storage
            .from(
              "product-images"
            )
            .getPublicUrl(
              filePath
            );

        newItems.push({
          url: data.publicUrl,
          alt: "",
        });
      }

      onChange([
        ...items,
        ...newItems,
      ]);
    } catch (uploadError) {
      console.error(
        "Gallery upload error:",
        uploadError
      );

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload images."
      );
    } finally {
      setUploading(false);
    }
  }

  function handleChange(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    if (
      event.target.files?.length
    ) {
      uploadFiles(
        event.target.files
      );
    }

    event.target.value = "";
  }

  function updateAlt(
    index: number,
    value: string
  ) {
    const updated = [...items];

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
    <div
      className="
        rounded-2xl
        border border-gray-200
        bg-white p-6
        shadow-sm
      "
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />

      <div
        className="
          flex flex-col gap-4
          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >
        <div>
          <h2
            className="
              text-lg font-semibold
              text-gray-900
            "
          >
            Product Gallery
          </h2>

          <p
            className="
              mt-1 text-sm
              text-gray-500
            "
          >
            Add screenshots,
            interfaces and other
            supporting product images.
          </p>
        </div>

        <button
          type="button"
          disabled={uploading}
          onClick={() =>
            inputRef.current?.click()
          }
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#073f30]
            px-4 py-2.5
            text-sm font-semibold
            text-white
            transition
            hover:bg-[#09543f]
            disabled:opacity-50
          "
        >
          {uploading ? (
            <Loader2
              size={16}
              className="animate-spin"
            />
          ) : (
            <Upload size={16} />
          )}

          {uploading
            ? "Uploading..."
            : "Add Images"}
        </button>
      </div>

      {items.length === 0 ? (
        <div
          className="
            mt-6 flex
            min-h-[180px]
            flex-col
            items-center
            justify-center
            rounded-xl
            border-2
            border-dashed
            border-gray-200
            bg-gray-50
            text-center
          "
        >
          <ImagePlus
            size={30}
            className="text-gray-300"
          />

          <p
            className="
              mt-3 text-sm
              font-semibold
              text-gray-600
            "
          >
            No gallery images
          </p>

          <p
            className="
              mt-1 text-xs
              text-gray-400
            "
          >
            Upload screenshots or
            supporting product images.
          </p>
        </div>
      ) : (
        <div
          className="
            mt-6 grid gap-5
            sm:grid-cols-2
          "
        >
          {items.map(
            (item, index) => (
              <div
                key={`${item.url}-${index}`}
                className="
                  overflow-hidden
                  rounded-xl
                  border
                  border-gray-200
                "
              >
                <img
                  src={item.url}
                  alt={
                    item.alt ||
                    `Gallery image ${
                      index + 1
                    }`
                  }
                  className="
                    aspect-video
                    w-full
                    object-cover
                  "
                />

                <div className="p-3">
                  <input
                    value={item.alt}
                    onChange={(
                      event
                    ) =>
                      updateAlt(
                        index,
                        event.target
                          .value
                      )
                    }
                    placeholder="Image description / alt text"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-200
                      px-3 py-2
                      text-sm
                      outline-none
                      focus:border-[#073f30]
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(
                        index
                      )
                    }
                    className="
                      mt-3
                      inline-flex
                      items-center
                      gap-2
                      text-xs
                      font-semibold
                      text-red-600
                    "
                  >
                    <Trash2
                      size={14}
                    />

                    Remove
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {error && (
        <div
          className="
            mt-4 rounded-xl
            border border-red-100
            bg-red-50
            px-4 py-3
            text-sm
            text-red-700
          "
        >
          {error}
        </div>
      )}
    </div>
  );
}

