const cloudName = () =>
  process.env.REACT_APP_CLOUDINARY_CLOUD_NAME?.trim() || "";
const uploadPreset = () =>
  process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET?.trim() || "";

export function getCloudinaryConfig() {
  return { cloudName: cloudName(), uploadPreset: uploadPreset() };
}

/**
 * Upload a file (image or video) to Cloudinary using an unsigned upload preset.
 */
export async function uploadToCloudinary(file) {
  const { cloudName: name, uploadPreset: preset } = getCloudinaryConfig();
  if (!name || !preset) {
    throw new Error(
      "Set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET in .env.local"
    );
  }
  const isVideo =
    typeof file?.type === "string" && file.type.startsWith("video/");
  const resource = isVideo ? "video" : "image";
  const url = `https://api.cloudinary.com/v1_1/${name}/${resource}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  const res = await fetch(url, { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `Upload failed (${res.status})`);
  }
  return data.secure_url;
}

export async function uploadMany(files) {
  const list = [...files].filter(Boolean);
  const urls = [];
  for (const f of list) {
    urls.push(await uploadToCloudinary(f));
  }
  return urls;
}
