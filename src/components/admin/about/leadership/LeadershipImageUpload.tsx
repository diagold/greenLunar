"use client";

import {
  ChangeEvent,
  useRef,
  useState,
} from "react";

import {
  ImagePlus,
  Loader2,
  RefreshCw,
  Trash2,
  UploadCloud,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";


/* =========================================================
   CONSTANTS
========================================================= */

const MAX_SOURCE_SIZE = 25 * 1024 * 1024; // 25 MB
const TARGET_OUTPUT_SIZE = 5 * 1024 * 1024; // 5 MB

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;

const WEBP_QUALITIES = [
  0.9,
  0.82,
  0.74,
  0.66,
  0.58,
  0.5,
];


/* =========================================================
   TYPES
========================================================= */

type LeadershipImageUploadProps = {
  value: string;

  onChange: (
    value: string
  ) => void;

  label?: string;

  description?: string;

  previewAlt?: string;
};


/* =========================================================
   COMPONENT
========================================================= */

export default function LeadershipImageUpload({
  value,
  onChange,
  label = "Leadership Image",
  description = "Upload a JPG, PNG or WEBP image. Large images will be automatically optimized.",
  previewAlt = "Leadership image preview",
}: LeadershipImageUploadProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    optimizationMessage,
    setOptimizationMessage,
  ] = useState("");


  /* =======================================================
     SELECT FILE
  ======================================================= */

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    /*
     * Reset input immediately so the same
     * file can be selected again later.
     */
    event.target.value = "";

    if (!file) {
      return;
    }

    await handleUpload(file);
  }


  /* =======================================================
     UPLOAD
  ======================================================= */

  async function handleUpload(
    file: File
  ) {
    setError("");
    setOptimizationMessage("");

    /*
     * Validate image.
     */
    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Please select a valid image file."
      );

      return;
    }

    /*
     * Protect browser memory from extremely
     * large source files.
     */
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
      /*
       * Optimize before uploading.
       */
      const result =
        await optimizeImage(
          file
        );

      const optimizedFile =
        result.blob;

      /*
       * Show optimization information.
       */
      const originalMB =
        bytesToMB(
          file.size
        );

      const optimizedMB =
        bytesToMB(
          optimizedFile.size
        );

      setOptimizationMessage(
        `Optimized from ${originalMB} MB to ${optimizedMB} MB (${result.width} × ${result.height}px).`
      );

      /*
       * Upload optimized WebP.
       */
      const supabase =
        createClient();

      const fileName =
        `${crypto.randomUUID()}.webp`;

      const filePath =
        `about/leadership/${fileName}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("product-images")
        .upload(
          filePath,
          optimizedFile,
          {
            contentType:
              "image/webp",

            cacheControl:
              "31536000",

            upsert: false,
          }
        );

      if (uploadError) {
        throw new Error(
          uploadError.message
        );
      }

      /*
       * Get public URL.
       */
      const {
        data: publicUrlData,
      } = supabase.storage
        .from("product-images")
        .getPublicUrl(
          filePath
        );

      const publicUrl =
        publicUrlData.publicUrl;

      if (!publicUrl) {
        throw new Error(
          "Unable to generate the image URL."
        );
      }

      onChange(publicUrl);
    } catch (err) {
      console.error(
        "Leadership image upload error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload image."
      );
    } finally {
      setUploading(false);
    }
  }


  /* =======================================================
     REMOVE FROM FORM
  ======================================================= */

  function removeImage() {
    onChange("");

    setOptimizationMessage("");
    setError("");
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-3">

      {/* LABEL */}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {description}
        </p>
      </div>


      {/* HIDDEN INPUT */}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={
          handleFileChange
        }
      />


      {/* ===================================================
          EXISTING IMAGE
      =================================================== */}

      {value ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

          {/* PREVIEW */}

          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-gray-100">

            <img
              src={value}
              alt={previewAlt}
              className="max-h-[420px] w-full object-contain"
            />


            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">

                <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-lg">

                  <Loader2
                    size={20}
                    className="animate-spin text-green-700"
                  />

                  <span className="text-sm font-medium text-gray-700">
                    Optimizing image...
                  </span>

                </div>

              </div>
            )}

          </div>


          {/* IMAGE ACTIONS */}

          <div className="flex flex-col gap-3 border-t border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">

              <p className="text-sm font-medium text-gray-700">
                Image uploaded
              </p>

              <p className="mt-1 truncate text-xs text-gray-400">
                {value}
              </p>

            </div>


            <div className="flex gap-2">

              <button
                type="button"
                disabled={uploading}
                onClick={() =>
                  inputRef.current?.click()
                }
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <RefreshCw
                    size={16}
                  />
                )}

                Replace
              </button>


              <button
                type="button"
                disabled={uploading}
                onClick={
                  removeImage
                }
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2
                  size={16}
                />

                Remove
              </button>

            </div>

          </div>

        </div>
      ) : (

        /* =================================================
           EMPTY UPLOAD STATE
        ================================================= */

        <button
          type="button"
          disabled={uploading}
          onClick={() =>
            inputRef.current?.click()
          }
          className="group flex min-h-[260px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center transition hover:border-green-400 hover:bg-green-50/40 disabled:cursor-not-allowed disabled:opacity-60"
        >

          {uploading ? (
            <>
              <Loader2
                size={34}
                className="animate-spin text-green-700"
              />

              <p className="mt-4 text-sm font-semibold text-gray-700">
                Optimizing and uploading...
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Please wait while the image is processed.
              </p>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm transition group-hover:shadow-md">

                <ImagePlus
                  size={26}
                  className="text-green-700"
                />

              </div>

              <p className="mt-4 text-sm font-semibold text-gray-800">
                Upload leadership image
              </p>

              <p className="mt-2 max-w-sm text-xs leading-5 text-gray-500">
                Click to select an image.
                Large images will automatically
                be resized and converted to WebP.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600">

                <UploadCloud
                  size={15}
                />

                Choose Image

              </div>
            </>
          )}

        </button>
      )}


      {/* ===================================================
          OPTIMIZATION RESULT
      =================================================== */}

      {optimizationMessage && (
        <div className="rounded-lg border border-green-100 bg-green-50 px-3 py-2">

          <p className="text-xs font-medium text-green-700">
            {optimizationMessage}
          </p>

        </div>
      )}


      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">

          <p className="text-xs font-medium text-red-700">
            {error}
          </p>

        </div>
      )}


      {/* ===================================================
          GUIDANCE
      =================================================== */}

      <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-gray-400">

        <span>
          Maximum source: 25MB
        </span>

        <span>
          Maximum dimensions: 1920 × 1920
        </span>

        <span>
          Output: WebP
        </span>

        <span>
          Target: under 5MB
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   IMAGE OPTIMIZATION
========================================================= */

async function optimizeImage(
  file: File
): Promise<{
  blob: Blob;
  width: number;
  height: number;
}> {
  let bitmap: ImageBitmap;

  try {
    bitmap =
      await createImageBitmap(
        file
      );
  } catch {
    throw new Error(
      "The selected image could not be processed. Please try a JPG, PNG or WEBP image."
    );
  }


  try {
    const dimensions =
      calculateDimensions(
        bitmap.width,
        bitmap.height
      );

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width =
      dimensions.width;

    canvas.height =
      dimensions.height;

    const context =
      canvas.getContext(
        "2d",
        {
          alpha: true,
        }
      );

    if (!context) {
      throw new Error(
        "Your browser could not process this image."
      );
    }

    /*
     * High-quality browser resize.
     */
    context.imageSmoothingEnabled =
      true;

    context.imageSmoothingQuality =
      "high";

    context.drawImage(
      bitmap,
      0,
      0,
      dimensions.width,
      dimensions.height
    );


    /*
     * Try progressively lower WebP quality
     * until the file falls below the target.
     */
    let lastBlob:
      | Blob
      | null = null;

    for (
      const quality of WEBP_QUALITIES
    ) {
      const blob =
        await canvasToWebP(
          canvas,
          quality
        );

      lastBlob = blob;

      if (
        blob.size <=
        TARGET_OUTPUT_SIZE
      ) {
        return {
          blob,
          width:
            dimensions.width,
          height:
            dimensions.height,
        };
      }
    }


    /*
     * If 1920px + quality reduction is still
     * above 5MB, perform a second resize pass.
     */
    if (
      lastBlob &&
      lastBlob.size >
        TARGET_OUTPUT_SIZE
    ) {
      const reduced =
        await createReducedVersion(
          canvas
        );

      if (
        reduced.blob.size <=
        TARGET_OUTPUT_SIZE
      ) {
        return reduced;
      }
    }


    throw new Error(
      "The optimized image is still larger than 5MB. Please select a smaller image."
    );
  } finally {
    bitmap.close();
  }
}


/* =========================================================
   DIMENSIONS
========================================================= */

function calculateDimensions(
  originalWidth: number,
  originalHeight: number
) {
  let width =
    originalWidth;

  let height =
    originalHeight;

  if (
    width <= MAX_WIDTH &&
    height <= MAX_HEIGHT
  ) {
    return {
      width,
      height,
    };
  }

  const widthRatio =
    MAX_WIDTH /
    width;

  const heightRatio =
    MAX_HEIGHT /
    height;

  const ratio =
    Math.min(
      widthRatio,
      heightRatio
    );

  width =
    Math.round(
      width * ratio
    );

  height =
    Math.round(
      height * ratio
    );

  return {
    width:
      Math.max(1, width),

    height:
      Math.max(1, height),
  };
}


/* =========================================================
   SECOND RESIZE PASS
========================================================= */

async function createReducedVersion(
  sourceCanvas: HTMLCanvasElement
): Promise<{
  blob: Blob;
  width: number;
  height: number;
}> {
  /*
   * Reduce another 20%.
   */
  const width =
    Math.max(
      1,
      Math.round(
        sourceCanvas.width *
          0.8
      )
    );

  const height =
    Math.max(
      1,
      Math.round(
        sourceCanvas.height *
          0.8
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
    throw new Error(
      "Unable to resize the image."
    );
  }

  context.imageSmoothingEnabled =
    true;

  context.imageSmoothingQuality =
    "high";

  context.drawImage(
    sourceCanvas,
    0,
    0,
    width,
    height
  );


  /*
   * Second compression cycle.
   */
  for (
    const quality of [
      0.78,
      0.7,
      0.62,
      0.54,
      0.46,
    ]
  ) {
    const blob =
      await canvasToWebP(
        canvas,
        quality
      );

    if (
      blob.size <=
      TARGET_OUTPUT_SIZE
    ) {
      return {
        blob,
        width,
        height,
      };
    }
  }


  /*
   * Return final attempt.
   */
  const blob =
    await canvasToWebP(
      canvas,
      0.42
    );

  return {
    blob,
    width,
    height,
  };
}


/* =========================================================
   CANVAS -> WEBP
========================================================= */

function canvasToWebP(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob> {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                "Unable to convert the image to WebP."
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


/* =========================================================
   SIZE DISPLAY
========================================================= */

function bytesToMB(
  bytes: number
) {
  return (
    bytes /
    (1024 * 1024)
  ).toFixed(2);
}