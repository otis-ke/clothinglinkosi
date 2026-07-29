import React, { useState, useCallback } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "../../firebase/client";
import { auth } from "../firebase/firebase";
import {
  uploadPublicMedia,
  canPerformBinaryUpload,
} from "../../services/mediaUpload";

/**
 * Admin card: preview left, caption + submit right.
 * Upload: Cloudinary (if preset + cloud set) else Firebase Storage; URL saved in Firestore.
 */
export default function AdminPostUploader() {
  const [user] = useAuthState(auth);

  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleFileChange = useCallback((e) => {
    const selected = e.target.files?.[0];
    e.target.value = "";
    if (!selected) return;

    setFile(selected);
    setIsVideo(typeof selected.type === "string" && selected.type.startsWith("video/"));

    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(selected);
    });
  }, []);

  const resetForm = useCallback(() => {
    setCaption("");
    setTitle("");
    setFile(null);
    setIsVideo(false);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!file) {
      alert("Please select an image or video first.");
      return;
    }

    if (!canPerformBinaryUpload()) {
      alert(
        "Set REACT_APP_CLOUDINARY_UPLOAD_PRESET (with cloud name) or Firebase Storage bucket + rules — see .env.example."
      );
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const imageUrl = await uploadPublicMedia(file);

      await addDoc(collection(db, "posts"), {
        title: title.trim() || null,
        caption: caption.trim(),
        imageUrl,
        mediaType: isVideo ? "video" : "image",
        username:
          user?.displayName || user?.email || "admin_panel",
        uid: user?.uid || null,
        timestamp: serverTimestamp(),
      });

      resetForm();
      setStatus("Posted successfully — saved URL in Firestore collection `posts`.");
    } catch (err) {
      console.error(err);
      setStatus(err.message || "Upload failed.");
      alert(err.message || "Failed to upload post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-tw-root flex justify-center items-start min-h-0 bg-gray-100 p-4 rounded-lg">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-1 text-gray-800">
          Create post
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Upload to Cloudinary, then store the returned <code className="text-xs bg-gray-100 px-1 rounded">secure_url</code> in Firestore.
        </p>

        {status && (
          <p className="mb-4 text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded px-3 py-2">
            {status}
          </p>
        )}

        <form className="flex flex-col md:flex-row gap-6" onSubmit={handleUpload}>
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-64 overflow-hidden bg-gray-50 relative">
            {preview ? (
              isVideo ? (
                <video
                  src={preview}
                  className="w-full h-full object-cover"
                  controls
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="text-gray-400 text-center pointer-events-none p-4">
                <p className="font-medium">Media preview</p>
                <p className="text-sm mt-1">Tap to choose image or video</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-4 justify-between">
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500">
                Signed-in user:{" "}
                <strong>{user?.email || user?.displayName || "not signed in (uses \"admin_panel\")"}</strong>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
                loading || !file
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Uploading…" : "Post to Firebase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
