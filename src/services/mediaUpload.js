import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../firebase/client";
import { uploadToCloudinary, getCloudinaryConfig } from "./cloudinary";

function sanitizeFilename(name) {
  if (!name || typeof name !== "string") return "file";
  const n = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  return n || "file";
}

/** True when we can POST a file somewhere (Cloudinary preset or Firebase Storage bucket). */
export function canPerformBinaryUpload() {
  const { cloudName, uploadPreset } = getCloudinaryConfig();
  const hasCloudinary =
    Boolean(cloudName) && Boolean(uploadPreset);
  const bucket =
    (process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "").trim();
  return hasCloudinary || Boolean(bucket);
}

/** Upload binary; prefer Cloudinary when cloud + preset are set, otherwise Firebase Storage. */
export async function uploadPublicMedia(file) {
  if (!file) {
    throw new Error("No file selected.");
  }
  const { cloudName, uploadPreset } = getCloudinaryConfig();
  if (cloudName && uploadPreset) {
    return uploadToCloudinary(file);
  }

  const bucket = (process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "").trim();
  if (!bucket) {
    throw new Error(
      "Add REACT_APP_CLOUDINARY_UPLOAD_PRESET in .env.local, or configure REACT_APP_FIREBASE_STORAGE_BUCKET and Storage rules."
    );
  }

  try {
    const storage = getStorage(app);
    const base = sanitizeFilename(file.name);
    const objectPath = `admin_uploads/${Date.now()}_${Math.random().toString(36).slice(2, 10)}_${base}`;
    const storageRef = ref(storage, objectPath);
    await uploadBytes(storageRef, file, {
      contentType: file.type || undefined,
    });
    return getDownloadURL(storageRef);
  } catch (err) {
    const code = err?.code || "";
    if (code === "storage/unauthorized") {
      throw new Error(
        "Firebase Storage denied this upload (rules). Allow writes for authenticated users to admin_uploads/ and ensure you're signed in, or use a Cloudinary unsigned preset."
      );
    }
    throw err;
  }
}

export async function uploadMany(files) {
  const list = [...files].filter(Boolean);
  const urls = [];
  for (const f of list) {
    urls.push(await uploadPublicMedia(f));
  }
  return urls;
}
