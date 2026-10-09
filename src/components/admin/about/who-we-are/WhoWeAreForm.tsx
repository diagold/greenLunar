"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import WhoWeAreImageUpload from "@/app/admin/(dashboard)/about/who-we-are/WhoWeAreImageUpload";

import {
  createWhoWeAreImage,
  deleteWhoWeAreImage,
  reorderWhoWeAreImages,
  toggleWhoWeAreImage,
  updateWhoWeAreImage,
  updateWhoWeAreSettings,
} from "@/app/admin/(dashboard)/about/who-we-are/actions";


/* =========================================================
   TYPES
========================================================= */

type Settings = {
  id: string;

  eyebrow: string | null;
  heading: string;
  highlight: string | null;

  paragraph_one: string | null;
  paragraph_two: string | null;
  paragraph_three: string | null;

  is_active: boolean;
};

type ImageItem = {
  id: string;
  section_id: string;

  image_url: string;
  image_alt: string | null;

  sort_order: number;
  is_active: boolean;
};

type Props = {
  settings: Settings;
  images: ImageItem[];
};

type ImageForm = {
  imageUrl: string;
  imageAlt: string;
  isActive: boolean;
};

const emptyImage: ImageForm = {
  imageUrl: "",
  imageAlt: "",
  isActive: true,
};


/* =========================================================
   COMPONENT
========================================================= */

export default function WhoWeAreForm({
  settings,
  images,
}: Props) {
  const [eyebrow, setEyebrow] =
    useState(
      settings.eyebrow ?? ""
    );

  const [heading, setHeading] =
    useState(
      settings.heading ?? ""
    );

  const [highlight, setHighlight] =
    useState(
      settings.highlight ?? ""
    );

  const [
    paragraphOne,
    setParagraphOne,
  ] = useState(
    settings.paragraph_one ?? ""
  );

  const [
    paragraphTwo,
    setParagraphTwo,
  ] = useState(
    settings.paragraph_two ?? ""
  );

  const [
    paragraphThree,
    setParagraphThree,
  ] = useState(
    settings.paragraph_three ?? ""
  );

  const [
    sectionActive,
    setSectionActive,
  ] = useState(
    settings.is_active
  );

  const [
    imageItems,
    setImageItems,
  ] = useState<ImageItem[]>(
    [...images].sort(
      (a, b) =>
        a.sort_order -
        b.sort_order
    )
  );

  const [
    editorOpen,
    setEditorOpen,
  ] = useState(false);

  const [
    editingImage,
    setEditingImage,
  ] = useState<ImageItem | null>(
    null
  );

  const [
    deletingImage,
    setDeletingImage,
  ] = useState<ImageItem | null>(
    null
  );

  const [
    imageForm,
    setImageForm,
  ] = useState<ImageForm>({
    ...emptyImage,
  });

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    isPending,
    startTransition,
  ] = useTransition();


  /* =========================================================
     HELPERS
  ========================================================= */

  function clearMessages() {
    setSuccessMessage("");
    setErrorMessage("");
  }

  function closeEditor() {
    setEditorOpen(false);

    setEditingImage(null);

    setImageForm({
      ...emptyImage,
    });
  }

  function openNewImage() {
    clearMessages();

    setDeletingImage(null);
    setEditingImage(null);

    setImageForm({
      ...emptyImage,
    });

    setEditorOpen(true);
  }

  function openEditImage(
    image: ImageItem
  ) {
    clearMessages();

    setDeletingImage(null);

    setEditingImage(image);

    setImageForm({
      imageUrl:
        image.image_url,

      imageAlt:
        image.image_alt ?? "",

      isActive:
        image.is_active,
    });

    setEditorOpen(true);
  }


  /* =========================================================
     SAVE SECTION
  ========================================================= */

  function saveSection() {
    clearMessages();

    if (!heading.trim()) {
      setErrorMessage(
        "Section heading is required."
      );

      return;
    }

    startTransition(async () => {
      try {
        await updateWhoWeAreSettings(
          settings.id,
          {
            eyebrow,
            heading,
            highlight,

            paragraphOne,
            paragraphTwo,
            paragraphThree,

            isActive:
              sectionActive,
          }
        );

        setSuccessMessage(
          "Who We Are section updated successfully."
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update section."
        );
      }
    });
  }


  /* =========================================================
     CREATE IMAGE
  ========================================================= */

  function createImage() {
    clearMessages();

    if (
      !imageForm.imageUrl.trim()
    ) {
      setErrorMessage(
        "Please upload an image."
      );

      return;
    }

    startTransition(async () => {
      try {
        const result =
          await createWhoWeAreImage(
            {
              sectionId:
                settings.id,

              imageUrl:
                imageForm.imageUrl,

              imageAlt:
                imageForm.imageAlt,

              sortOrder:
                imageItems.length +
                1,

              isActive:
                imageForm.isActive,
            }
          );

        const image =
          result.image as ImageItem;

        setImageItems(
          (current) => [
            ...current,
            image,
          ]
        );

        closeEditor();

        setSuccessMessage(
          "Image added successfully."
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to add image."
        );
      }
    });
  }


  /* =========================================================
     UPDATE IMAGE
  ========================================================= */

  function updateImage() {
    if (!editingImage) {
      return;
    }

    clearMessages();

    if (
      !imageForm.imageUrl.trim()
    ) {
      setErrorMessage(
        "Image is required."
      );

      return;
    }

    startTransition(async () => {
      try {
        await updateWhoWeAreImage(
          editingImage.id,
          {
            sectionId:
              settings.id,

            imageUrl:
              imageForm.imageUrl,

            imageAlt:
              imageForm.imageAlt,

            sortOrder:
              editingImage.sort_order,

            isActive:
              imageForm.isActive,
          }
        );

        const updated: ImageItem = {
          ...editingImage,

          image_url:
            imageForm.imageUrl.trim(),

          image_alt:
            imageForm.imageAlt.trim() ||
            "GreenLunar",

          is_active:
            imageForm.isActive,
        };

        setImageItems(
          (current) =>
            current.map(
              (image) =>
                image.id ===
                editingImage.id
                  ? updated
                  : image
            )
        );

        closeEditor();

        setSuccessMessage(
          "Image updated successfully."
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update image."
        );
      }
    });
  }


  /* =========================================================
     TOGGLE
  ========================================================= */

  function toggleImage(
    image: ImageItem
  ) {
    clearMessages();

    const nextValue =
      !image.is_active;

    startTransition(async () => {
      try {
        await toggleWhoWeAreImage(
          image.id,
          nextValue
        );

        setImageItems(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                image.id
                  ? {
                      ...item,

                      is_active:
                        nextValue,
                    }
                  : item
            )
        );

        setSuccessMessage(
          nextValue
            ? "Image is now visible."
            : "Image is now hidden."
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to change image visibility."
        );
      }
    });
  }


  /* =========================================================
     DELETE
  ========================================================= */

  function removeImage(
    image: ImageItem
  ) {
    clearMessages();

    startTransition(async () => {
      try {
        await deleteWhoWeAreImage(
          image.id
        );

        const remaining =
          imageItems.filter(
            (item) =>
              item.id !==
              image.id
          );

        const normalized =
          remaining.map(
            (item, index) => ({
              ...item,

              sort_order:
                index + 1,
            })
          );

        if (
          normalized.length > 0
        ) {
          await reorderWhoWeAreImages(
            normalized.map(
              (item) => item.id
            )
          );
        }

        setImageItems(
          normalized
        );

        setDeletingImage(
          null
        );

        setSuccessMessage(
          "Image deleted successfully."
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to delete image."
        );
      }
    });
  }


  /* =========================================================
     REORDER
  ========================================================= */

  function moveImage(
    index: number,
    direction: "up" | "down"
  ) {
    const target =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      target < 0 ||
      target >=
        imageItems.length
    ) {
      return;
    }

    clearMessages();

    const previous = [
      ...imageItems,
    ];

    const reordered = [
      ...imageItems,
    ];

    [
      reordered[index],
      reordered[target],
    ] = [
      reordered[target],
      reordered[index],
    ];

    const normalized =
      reordered.map(
        (item, itemIndex) => ({
          ...item,

          sort_order:
            itemIndex + 1,
        })
      );

    setImageItems(normalized);

    startTransition(async () => {
      try {
        await reorderWhoWeAreImages(
          normalized.map(
            (item) => item.id
          )
        );

        setSuccessMessage(
          "Image order updated."
        );
      } catch (error) {
        setImageItems(previous);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to reorder images."
        );
      }
    });
  }


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-8">

      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <Check size={18} />

          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}


      {/* =========================================
          CONTENT
      ========================================== */}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Section Content
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the introduction
              displayed beside the image
              gallery.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setSectionActive(
                (current) =>
                  !current
              )
            }
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
              sectionActive
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {sectionActive ? (
              <Eye size={17} />
            ) : (
              <EyeOff size={17} />
            )}

            {sectionActive
              ? "Section Visible"
              : "Section Hidden"}
          </button>
        </div>

        <div className="grid gap-6">
          <Field
            label="Eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
          />

          <Field
            label="Heading"
            value={heading}
            onChange={setHeading}
          />

          <Field
            label="Green Highlight"
            value={highlight}
            onChange={setHighlight}
          />

          <TextArea
            label="Paragraph One"
            value={paragraphOne}
            onChange={
              setParagraphOne
            }
          />

          <TextArea
            label="Paragraph Two"
            value={paragraphTwo}
            onChange={
              setParagraphTwo
            }
          />

          <TextArea
            label="Paragraph Three"
            value={paragraphThree}
            onChange={
              setParagraphThree
            }
          />
        </div>

        <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
          <button
            type="button"
            disabled={isPending}
            onClick={saveSection}
            className="inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a503d] disabled:opacity-60"
          >
            {isPending ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <Save size={18} />
            )}

            Save Section
          </button>
        </div>
      </section>


      {/* =========================================
          IMAGE EDITOR
      ========================================== */}

      {editorOpen && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-7 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingImage
                  ? "Edit Image"
                  : "Add Image"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Upload an image for the
                Who We Are collage.
              </p>
            </div>

            <button
              type="button"
              onClick={closeEditor}
              className="rounded-lg border border-gray-200 p-2 text-gray-500"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              <Field
                label="Image Alt Text"
                value={
                  imageForm.imageAlt
                }
                onChange={(value) =>
                  setImageForm(
                    (current) => ({
                      ...current,

                      imageAlt:
                        value,
                    })
                  )
                }
              />

              <Field
                label="Image URL"
                value={
                  imageForm.imageUrl
                }
                onChange={(value) =>
                  setImageForm(
                    (current) => ({
                      ...current,

                      imageUrl:
                        value,
                    })
                  )
                }
              />

              <button
                type="button"
                onClick={() =>
                  setImageForm(
                    (current) => ({
                      ...current,

                      isActive:
                        !current.isActive,
                    })
                  )
                }
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
                  imageForm.isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {imageForm.isActive ? (
                  <Eye size={17} />
                ) : (
                  <EyeOff
                    size={17}
                  />
                )}

                {imageForm.isActive
                  ? "Visible"
                  : "Hidden"}
              </button>
            </div>

            <WhoWeAreImageUpload
              value={
                imageForm.imageUrl
              }
              onChange={(url) =>
                setImageForm(
                  (current) => ({
                    ...current,

                    imageUrl: url,
                  })
                )
              }
            />
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={closeEditor}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={
                editingImage
                  ? updateImage
                  : createImage
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isPending ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Save
                  size={17}
                />
              )}

              {editingImage
                ? "Save Image"
                : "Add Image"}
            </button>
          </div>
        </section>
      )}


      {/* =========================================
          IMAGE COLLECTION
      ========================================== */}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-6 lg:px-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Image Gallery
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {imageItems.length} image(s)
            </p>
          </div>

          <button
            type="button"
            onClick={openNewImage}
            className="inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={17} />
            Add Image
          </button>
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-4">
          {imageItems.map(
            (image, index) => (
              <article
                key={image.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img
                    src={
                      image.image_url
                    }
                    alt={
                      image.image_alt ??
                      "GreenLunar"
                    }
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      Position{" "}
                      {index + 1}
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        image.is_active
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {image.is_active
                        ? "Visible"
                        : "Hidden"}
                    </span>
                  </div>

                  <p className="mt-3 truncate text-sm font-medium text-gray-800">
                    {image.image_alt ||
                      "No alt text"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={
                        index === 0 ||
                        isPending
                      }
                      onClick={() =>
                        moveImage(
                          index,
                          "up"
                        )
                      }
                      className="rounded-lg border border-gray-200 p-2 text-gray-500 disabled:opacity-30"
                    >
                      <ChevronUp
                        size={15}
                      />
                    </button>

                    <button
                      type="button"
                      disabled={
                        index ===
                          imageItems.length -
                            1 ||
                        isPending
                      }
                      onClick={() =>
                        moveImage(
                          index,
                          "down"
                        )
                      }
                      className="rounded-lg border border-gray-200 p-2 text-gray-500 disabled:opacity-30"
                    >
                      <ChevronDown
                        size={15}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleImage(
                          image
                        )
                      }
                      className="rounded-lg border border-gray-200 p-2 text-gray-500"
                    >
                      {image.is_active ? (
                        <Eye
                          size={15}
                        />
                      ) : (
                        <EyeOff
                          size={15}
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openEditImage(
                          image
                        )
                      }
                      className="rounded-lg border border-gray-200 p-2 text-gray-500"
                    >
                      <Pencil
                        size={15}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDeletingImage(
                          image
                        )
                      }
                      className="rounded-lg border border-red-200 p-2 text-red-600"
                    >
                      <Trash2
                        size={15}
                      />
                    </button>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      </section>


      {/* =========================================
          DELETE CONFIRMATION
      ========================================== */}

      {deletingImage && (
        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900">
            Delete this image?
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            This image will be
            permanently removed from the
            Who We Are gallery.
          </p>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() =>
                setDeletingImage(
                  null
                )
              }
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                removeImage(
                  deletingImage
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Trash2 size={16} />
              Delete Image
            </button>
          </div>
        </section>
      )}
    </div>
  );
}


/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
}: {
  label: string;

  value: string;

  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}


/* =========================================================
   TEXTAREA
========================================================= */

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;

  value: string;

  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <textarea
        value={value}
        rows={4}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}