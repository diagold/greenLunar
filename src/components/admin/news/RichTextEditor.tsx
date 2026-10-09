
"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

import { CustomImage } from "./CustomImage";
import { uploadNewsInlineImage } from "@/app/admin/news/image-actions";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

type ImageAlignment = "left" | "center" | "right";
type ImageWidth = "25%" | "50%" | "75%" | "100%";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeContent(content: string) {
  if (!content.trim()) return "";

  if (!/<[a-z][\s\S]*>/i.test(content)) {
    return content
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map((paragraph) => {
        const escaped = escapeHtml(paragraph.trim())
          .replace(/\r?\n/g, "<br>");

        return `<p>${escaped}</p>`;
      })
      .join("");
  }

  return content;
}

function imageWidthClass(width: string) {
  switch (width) {
    case "25%":
      return "w-1/4";
    case "50%":
      return "w-1/2";
    case "75%":
      return "w-3/4";
    default:
      return "w-full";
  }
}

function imageAlignmentClass(alignment: string) {
  switch (alignment) {
    case "left":
      return "mr-auto ml-0";
    case "right":
      return "ml-auto mr-0";
    default:
      return "mx-auto";
  }
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const insertionPositionRef = useRef<number | null>(null);

  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,

      Underline,

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer nofollow",
        },
      }),

      CustomImage.configure({
        inline: false,
        allowBase64: false,
      }),
    ],

    content: normalizeContent(value),

    editorProps: {
      attributes: {
        class:
          "min-h-[350px] px-5 py-5 focus:outline-none text-gray-700 leading-8 break-words",
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const normalized = normalizeContent(value);

    // Compare parsed documents rather than raw HTML strings.
    // Tiptap may normalize markup when reading it.
    if (editor.getHTML() !== normalized) {
      editor.commands.setContent(normalized, {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  function addLink() {
    if (!editor) return;

    const existingUrl =
      editor.getAttributes("link").href || "";

    const url = window.prompt(
      "Enter link URL:",
      existingUrl
    );

    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    try {
      const parsed = new URL(url.trim());

      if (!["http:", "https:"].includes(parsed.protocol)) {
        window.alert(
          "Only HTTP and HTTPS links are allowed."
        );
        return;
      }

      editor
        .chain()
        .focus()
        .setLink({
          href: parsed.toString(),
        })
        .run();
    } catch {
      window.alert("Please enter a valid URL.");
    }
  }

  function openImagePicker() {
    if (!editor || uploadingImage) return;

    setImageError("");

    insertionPositionRef.current =
      editor.state.selection.from;

    fileInputRef.current?.click();
  }

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file || !editor) return;

    setImageError("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError(
        "Only JPG, PNG and WebP images are supported."
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(
        "Image size must not exceed 5 MB."
      );

      event.target.value = "";
      return;
    }

    if (file.size === 0) {
      setImageError("The selected image is empty.");
      event.target.value = "";
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const result = await uploadNewsInlineImage(formData);

      if ("error" in result) {
        setImageError(result.error);
        return;
      }

      const savedPosition =
        insertionPositionRef.current ??
        editor.state.selection.from;

      const insertPosition = Math.min(
        Math.max(savedPosition, 0),
        editor.state.doc.content.size
      );

      const success = editor
        .chain()
        .focus()
        .insertContentAt(insertPosition, {
          type: "image",
          attrs: {
            src: result.url,
            alt: file.name,
            title: file.name,
            width: "100%",
            alignment: "center",
            caption: "",
          },
        })
        .run();

      if (!success) {
        setImageError(
          "The image uploaded, but could not be inserted into the article."
        );
      }
    } catch (error) {
      setImageError(
        error instanceof Error
          ? error.message
          : "Unable to upload image. Please try again."
      );
    } finally {
      setUploadingImage(false);
      insertionPositionRef.current = null;
      event.target.value = "";
    }
  }

  function updateImageAttribute(
    attributes: Record<string, string>
  ) {
    if (!editor || !editor.isActive("image")) return;

    editor
      .chain()
      .focus()
      .updateAttributes("image", attributes)
      .run();
  }

  function addImageCaption() {
    if (!editor || !editor.isActive("image")) return;

    const existingCaption =
      editor.getAttributes("image").caption || "";

    const caption = window.prompt(
      "Enter image caption:",
      existingCaption
    );

    if (caption === null) return;

    updateImageAttribute({
      caption: caption.trim(),
    });
  }

  function toolbarButton(
    label: string,
    action: () => void,
    active = false,
    disabled = false
  ) {
    return (
      <button
        type="button"
        onClick={action}
        disabled={disabled}
        className={`rounded-md border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
          active
            ? "border-green-700 bg-[#063d2b] text-white"
            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
        }`}
      >
        {label}
      </button>
    );
  }

  if (!editor) {
    return (
      <div className="flex min-h-[350px] items-center justify-center rounded-xl border border-gray-200 bg-white text-sm text-gray-400">
        Loading editor...
      </div>
    );
  }

  const imageSelected = editor.isActive("image");

  const imageAttributes = imageSelected
    ? editor.getAttributes("image")
    : {};

  const currentWidth =
    (imageAttributes.width as ImageWidth) || "100%";

  const currentAlignment =
    (imageAttributes.alignment as ImageAlignment) ||
    "center";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* MAIN TOOLBAR */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 p-3">
        {toolbarButton(
          "H1",
          () =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 1 })
              .run(),
          editor.isActive("heading", { level: 1 })
        )}

        {toolbarButton(
          "H2",
          () =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run(),
          editor.isActive("heading", { level: 2 })
        )}

        {toolbarButton(
          "H3",
          () =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 3 })
              .run(),
          editor.isActive("heading", { level: 3 })
        )}

        <div className="mx-1 h-6 w-px bg-gray-200" />

        {toolbarButton(
          "Bold",
          () => editor.chain().focus().toggleBold().run(),
          editor.isActive("bold")
        )}

        {toolbarButton(
          "Italic",
          () => editor.chain().focus().toggleItalic().run(),
          editor.isActive("italic")
        )}

        {toolbarButton(
          "Underline",
          () =>
            editor.chain().focus().toggleUnderline().run(),
          editor.isActive("underline")
        )}

        <div className="mx-1 h-6 w-px bg-gray-200" />

        {toolbarButton(
          "Bullets",
          () =>
            editor.chain().focus().toggleBulletList().run(),
          editor.isActive("bulletList")
        )}

        {toolbarButton(
          "Numbers",
          () =>
            editor.chain().focus().toggleOrderedList().run(),
          editor.isActive("orderedList")
        )}

        {toolbarButton(
          "Quote",
          () =>
            editor.chain().focus().toggleBlockquote().run(),
          editor.isActive("blockquote")
        )}

        <div className="mx-1 h-6 w-px bg-gray-200" />

        {toolbarButton(
          "Link",
          addLink,
          editor.isActive("link")
        )}

        <button
          type="button"
          onClick={openImagePicker}
          disabled={uploadingImage}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
        >
          {uploadingImage
            ? "Uploading..."
            : "Insert Image"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageUpload}
          className="hidden"
          aria-label="Select article image"
        />

        <div className="mx-1 h-6 w-px bg-gray-200" />

        {toolbarButton(
          "Undo",
          () => editor.chain().focus().undo().run(),
          false,
          !editor.can().chain().focus().undo().run()
        )}

        {toolbarButton(
          "Redo",
          () => editor.chain().focus().redo().run(),
          false,
          !editor.can().chain().focus().redo().run()
        )}

        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="ml-auto rounded-md bg-[#063d2b] px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-900"
        >
          {showPreview ? "Edit Article" : "Preview"}
        </button>
      </div>

      {/* IMAGE FORMATTING TOOLBAR */}
      {imageSelected && !showPreview && (
        <div className="flex flex-wrap items-center gap-2 border-b border-green-100 bg-green-50 px-3 py-3">
          <span className="mr-2 text-xs font-semibold text-[#063d2b]">
            Image Settings
          </span>

          <select
            value={currentWidth}
            onChange={(event) =>
              updateImageAttribute({
                width: event.target.value,
              })
            }
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700"
            aria-label="Image width"
          >
            <option value="25%">25% Width</option>
            <option value="50%">50% Width</option>
            <option value="75%">75% Width</option>
            <option value="100%">100% Width</option>
          </select>

          {(
            [
              ["left", "Left"],
              ["center", "Centre"],
              ["right", "Right"],
            ] as const
          ).map(([alignment, label]) => (
            <button
              key={alignment}
              type="button"
              onClick={() =>
                updateImageAttribute({ alignment })
              }
              className={`rounded-md border px-3 py-2 text-xs font-medium ${
                currentAlignment === alignment
                  ? "border-[#063d2b] bg-[#063d2b] text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}

          <button
            type="button"
            onClick={addImageCaption}
            className="rounded-md bg-[#063d2b] px-3 py-2 text-xs font-semibold text-white hover:bg-green-900"
          >
            {imageAttributes.caption
              ? "Edit Caption"
              : "Add Caption"}
          </button>
        </div>
      )}

      {/* IMAGE UPLOAD ERROR */}
      {imageError && (
        <div
          role="alert"
          className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {imageError}
        </div>
      )}

      {uploadingImage && (
        <div className="border-b border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800">
          Uploading image to Supabase Storage...
        </div>
      )}

      {/* EDITOR / PREVIEW */}
      {showPreview ? (
        <div
          className="
            news-article-content
            min-h-[350px]
            break-words
            px-6 py-6
            text-gray-700
            leading-8

            [&_p]:mb-5
            [&_h1]:mb-5 [&_h1]:mt-8
            [&_h1]:text-3xl [&_h1]:font-semibold
            [&_h2]:mb-4 [&_h2]:mt-7
            [&_h2]:text-2xl [&_h2]:font-semibold
            [&_h3]:mb-4 [&_h3]:mt-6
            [&_h3]:text-xl [&_h3]:font-semibold

            [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-7
            [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-7

            [&_blockquote]:my-6
            [&_blockquote]:border-l-4
            [&_blockquote]:border-green-700
            [&_blockquote]:bg-green-50
            [&_blockquote]:px-5
            [&_blockquote]:py-4
            [&_blockquote]:italic

            [&_a]:text-green-700 [&_a]:underline
          "
          dangerouslySetInnerHTML={{
            __html: editor.getHTML(),
          }}
        />
      ) : (
        <div className="news-editor-content">
          <EditorContent editor={editor} />
        </div>
      )}

      {/* FOOTER */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 px-5 py-3">
        <p className="text-xs text-gray-400">
          Format text, insert links and upload images.
        </p>

        <p className="text-xs text-gray-400">
          JPG, PNG, WebP · Maximum 5 MB
        </p>
      </div>
    </div>
  );
}
