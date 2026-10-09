
"use server";

import { createClient } from "@/lib/supabase/server";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function uploadNewsInlineImage(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to upload images." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    profile.role !== "editor" ||
    !profile.is_active
  ) {
    return { error: "You do not have permission to upload images." };
  }

  const file = formData.get("image");

  if (!(file instanceof File)) {
    return { error: "Please select an image." };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Only JPG, PNG and WebP images are supported." };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return { error: "The image must not exceed 5 MB." };
  }

  if (file.size === 0) {
    return { error: "The selected image is empty." };
  }

  const extension =
    file.type === "image/jpeg"
      ? "jpg"
      : file.type === "image/png"
        ? "png"
        : "webp";

  const filename = `articles/inline-${crypto.randomUUID()}.${extension}`;

  const bytes = new Uint8Array(await file.arrayBuffer());

  // Validate the actual file signature, not just its MIME type.
  const validSignature =
    file.type === "image/jpeg"
      ? bytes[0] === 0xff &&
        bytes[1] === 0xd8 &&
        bytes[2] === 0xff
      : file.type === "image/png"
        ? bytes.length >= 8 &&
          [137, 80, 78, 71, 13, 10, 26, 10].every(
            (value, index) => bytes[index] === value
          )
        : bytes.length >= 12 &&
          String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
          String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";

  if (!validSignature) {
    return { error: "The file does not appear to be a valid image." };
  }

  const { error: uploadError } = await supabase.storage
    .from("news-images")
    .upload(filename, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { error: `Image upload failed: ${uploadError.message}` };
  }

  const { data } = supabase.storage
    .from("news-images")
    .getPublicUrl(filename);

  return { url: data.publicUrl };
}
