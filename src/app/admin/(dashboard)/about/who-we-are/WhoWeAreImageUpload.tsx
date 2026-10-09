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

const MAX_SOURCE_SIZE =
  25 * 1024 * 1024;

const MAX_UPLOAD_SIZE =
  5 * 1024 * 1024;

const MAX_WIDTH = 1600;


/* =========================================================
   OPTIMIZE IMAGE
========================================================= */

async function optimizeImage(
  file: File
) {
  const bitmap =
    await createImageBitmap(file);

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

  if (
    blob.size > MAX_UPLOAD_SIZE
  ) {
    throw new Error(
      "The optimized image is still larger than 5 MB."
    );
  }

  return blob;
}


/* =========================================================
   COMPONENT
========================================================= */

export default function WhoWeAreImageUpload({
  value,
  onChange,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [error, setError] =
    useState("");

  async function handleFile(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Please select an image file."
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
        await optimizeImage(file);

      const supabase =
        createClient();

      const filename =
        `${crypto.randomUUID()}.webp`;

      const path =
        `about/who-we-are/${filename}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("product-images")
        .upload(path, blob, {
          contentType:
            "image/webp",

          upsert: false,
        });

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
        inputRef.current.value =
          "";
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

      <div className="flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50">
        {value ? (
          <img
            src={value}
            alt="Who We Are preview"
            className="h-[220px] w-full object-cover"
          />
        ) : (
          <div className="text-center">
            <ImagePlus
              size={32}
              className="mx-auto text-gray-300"
            />

            <p className="mt-2 text-sm text-gray-500">
              No image selected
            </p>
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
              ? "Change Image"
              : "Upload Image"}
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