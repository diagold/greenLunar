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
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

const MAX_SOURCE_SIZE = 25 * 1024 * 1024;
const MAX_WIDTH = 1920;
const TARGET_MAX_SIZE = 5 * 1024 * 1024;

export default function CoreSolutionImageUpload({
  value,
  onChange,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================================================
     IMAGE COMPRESSION
  ========================================================= */

  async function compressImage(
    file: File
  ): Promise<Blob> {
    return new Promise(
      (resolve, reject) => {
        const image = new Image();

        const objectUrl =
          URL.createObjectURL(file);

        image.onload = () => {
          let width = image.width;
          let height = image.height;

          if (width > MAX_WIDTH) {
            const ratio =
              MAX_WIDTH / width;

            width = MAX_WIDTH;
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
            URL.revokeObjectURL(
              objectUrl
            );

            reject(
              new Error(
                "Unable to process image."
              )
            );

            return;
          }

          context.drawImage(
            image,
            0,
            0,
            width,
            height
          );

          URL.revokeObjectURL(
            objectUrl
          );

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(
                  new Error(
                    "Unable to compress image."
                  )
                );

                return;
              }

              resolve(blob);
            },
            "image/webp",
            0.82
          );
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

  /* =========================================================
     UPLOAD
  ========================================================= */

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");

    if (
      !file.type.startsWith("image/")
    ) {
      setError(
        "Please select a valid image file."
      );

      event.target.value = "";

      return;
    }

    if (
      file.size > MAX_SOURCE_SIZE
    ) {
      setError(
        "Image must be smaller than 25 MB."
      );

      event.target.value = "";

      return;
    }

    setUploading(true);

    try {
      const compressed =
        await compressImage(file);

      if (
        compressed.size >
        TARGET_MAX_SIZE
      ) {
        throw new Error(
          "The optimized image is still larger than 5 MB. Please use a smaller image."
        );
      }

      const supabase =
        createClient();

      const fileName = `${
        crypto.randomUUID()
      }.webp`;

      const filePath =
        `homepage/core-solutions/${fileName}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("product-images")
        .upload(
          filePath,
          compressed,
          {
            contentType:
              "image/webp",
            cacheControl: "3600",
            upsert: false,
          }
        );

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: publicUrlData,
      } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      if (
        !publicUrlData.publicUrl
      ) {
        throw new Error(
          "Unable to generate image URL."
        );
      }

      onChange(
        publicUrlData.publicUrl
      );
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload image."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value =
          "";
      }
    }
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="space-y-4">

      {/* IMAGE PREVIEW */}

      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
          <img
            src={value}
            alt="Core Solution preview"
            className="h-56 w-full object-cover"
          />

          <button
            type="button"
            onClick={() =>
              onChange("")
            }
            disabled={uploading}
            className="
              absolute
              right-3
              top-3
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-black/70
              text-white
              transition
              hover:bg-red-600
              disabled:opacity-50
            "
            aria-label="Remove image"
          >
            <X size={17} />
          </button>
        </div>
      ) : (
        <div
          className="
            flex
            h-48
            flex-col
            items-center
            justify-center
            rounded-xl
            border
            border-dashed
            border-gray-300
            bg-gray-50
            text-gray-400
          "
        >
          <ImagePlus
            size={30}
            strokeWidth={1.5}
          />

          <p className="mt-2 text-sm">
            No image selected
          </p>
        </div>
      )}

      {/* UPLOAD BUTTON */}

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={
            handleFileChange
          }
          className="hidden"
        />

        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          disabled={uploading}
          className="
            inline-flex
            items-center
            justify-center
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
            disabled:opacity-60
          "
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
                ? "Replace Image"
                : "Upload Image"}
            </>
          )}
        </button>

        <p className="mt-2 text-xs text-gray-400">
          JPG, PNG, WebP or other
          browser-supported image.
          Maximum source size 25 MB.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}