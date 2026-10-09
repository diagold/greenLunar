"use client";

import {
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

  onChange: (
    url: string
  ) => void;
};


const MAX_SOURCE_SIZE =
  25 * 1024 * 1024;

const TARGET_SIZE =
  5 * 1024 * 1024;

const MAX_WIDTH = 1400;


export default function CertificationLogoUpload({
  value,
  onChange,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");


  async function handleFile(
    file: File
  ) {
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
        "The source image must be 25MB or smaller."
      );

      return;
    }


    setUploading(true);


    try {
      const optimized =
        await optimizeImage(
          file
        );


      const supabase =
        createClient();


      const fileName =
        `${crypto.randomUUID()}.webp`;


      const filePath =
        `about/certifications/${fileName}`;


      const {
        error: uploadError,
      } = await supabase.storage
        .from("product-images")
        .upload(
          filePath,
          optimized,
          {
            contentType:
              "image/webp",

            upsert: false,
          }
        );


      if (uploadError) {
        throw new Error(
          uploadError.message
        );
      }


      const {
        data: publicUrlData,
      } = supabase.storage
        .from("product-images")
        .getPublicUrl(
          filePath
        );


      if (
        !publicUrlData
          .publicUrl
      ) {
        throw new Error(
          "Unable to generate image URL."
        );
      }


      onChange(
        publicUrlData.publicUrl
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload logo."
      );
    } finally {
      setUploading(false);
    }
  }


  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-gray-700">
        Certification Logo
      </label>


      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file =
            event.target
              .files?.[0];

          if (file) {
            void handleFile(
              file
            );
          }

          event.target.value =
            "";
        }}
      />


      {value ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-[#f7faf8]">

          <div className="flex min-h-[180px] items-center justify-center p-6">

            <img
              src={value}
              alt="Certification preview"
              className="max-h-[120px] max-w-full object-contain"
            />

          </div>


          <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 bg-white p-4">

            <button
              type="button"
              disabled={uploading}
              onClick={() =>
                inputRef.current?.click()
              }
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
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

              Replace Logo
            </button>


            <button
              type="button"
              disabled={uploading}
              onClick={() =>
                onChange("")
              }
              className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              Remove
            </button>

          </div>

        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() =>
            inputRef.current?.click()
          }
          className="flex min-h-[180px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center transition hover:border-green-400 hover:bg-green-50/40 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2
              size={28}
              className="animate-spin text-green-700"
            />
          ) : (
            <ImagePlus
              size={30}
              className="text-gray-400"
            />
          )}


          <span className="mt-3 text-sm font-semibold text-gray-700">
            {uploading
              ? "Uploading..."
              : "Upload certification logo"}
          </span>


          <span className="mt-1 text-xs text-gray-500">
            JPG, PNG, WEBP or similar
            image format
          </span>

        </button>
      )}


      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}


/* =========================================================
   IMAGE OPTIMIZATION
========================================================= */

async function optimizeImage(
  file: File
): Promise<Blob> {
  const bitmap =
    await createImageBitmap(
      file
    );


  const ratio =
    Math.min(
      1,
      MAX_WIDTH /
        bitmap.width
    );


  const width =
    Math.max(
      1,
      Math.round(
        bitmap.width *
          ratio
      )
    );


  const height =
    Math.max(
      1,
      Math.round(
        bitmap.height *
          ratio
      )
    );


  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width =
    width;

  canvas.height =
    height;


  const context =
    canvas.getContext(
      "2d"
    );


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


  const qualities = [
    0.9,
    0.82,
    0.74,
    0.66,
    0.58,
    0.5,
  ];


  let latestBlob:
    | Blob
    | null = null;


  for (
    const quality of qualities
  ) {
    const blob =
      await canvasToBlob(
        canvas,
        quality
      );


    latestBlob =
      blob;


    if (
      blob.size <=
      TARGET_SIZE
    ) {
      return blob;
    }
  }


  if (!latestBlob) {
    throw new Error(
      "Unable to optimize image."
    );
  }


  if (
    latestBlob.size >
    TARGET_SIZE
  ) {
    throw new Error(
      "The optimized image is still larger than 5MB. Please use a smaller image."
    );
  }


  return latestBlob;
}


function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob> {
  return new Promise(
    (resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                "Unable to convert image."
              )
            );

            return;
          }

          resolve(blob);
        },
        "image/webp",
        quality
      );
    }
  );
}