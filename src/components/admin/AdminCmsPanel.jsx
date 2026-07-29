import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase/client";
import { uploadPublicMedia, canPerformBinaryUpload } from "../../services/mediaUpload";
import MediaAsset from "../MediaAsset";
import "./AdminCmsPanel.css";

const COLLECTIONS = [
  { id: "women", label: "Women", schema: "product" },
  { id: "men", label: "Men", schema: "product" },
  { id: "kids", label: "Kids", schema: "product" },
  { id: "gifts", label: "Gifts", schema: "product" },
  { id: "decor", label: "Decor", schema: "product" },
  { id: "store_section", label: "Shop strip", schema: "storeCard" },
  { id: "linkosiblog", label: "Blog", schema: "blogPost" },
  { id: "intro_section", label: "Hero banner", schema: "introHero" },
];

const SCHEMA_META = {
  product: { badge: "Product", hasPrice: true, hasGallery: true },
  storeCard: { badge: "Card", hasPrice: false, hasGallery: false },
  blogPost: { badge: "Blog post", hasPrice: false, hasGallery: true },
  introHero: { badge: "Banner", hasPrice: false, hasGallery: false },
};

let uidCounter = 0;
const makeId = () => `m${Date.now()}_${uidCounter++}`;

function localInputToTimestamp(value) {
  if (!value) return Timestamp.now();
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return Timestamp.now();
  return Timestamp.fromDate(d);
}

function timestampToLocalInput(ts) {
  if (!ts || typeof ts.toDate !== "function") return "";
  const d = ts.toDate();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function defaultDatetimeLocal() {
  return timestampToLocalInput(Timestamp.now());
}

function formatKsh(n) {
  const num = Number(n);
  if (Number.isNaN(num)) return "";
  return `Ksh ${num.toLocaleString()}`;
}

function fileKind(f) {
  return typeof f?.type === "string" && f.type.startsWith("video/") ? "video" : "image";
}

/** Single-file preview (image or video) for a File or an existing URL. */
function MediaPreview({ file, url, className }) {
  const [objectUrl, setObjectUrl] = useState("");
  useEffect(() => {
    if (!file) {
      setObjectUrl("");
      return undefined;
    }
    const u = URL.createObjectURL(file);
    setObjectUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  const src = file ? objectUrl : url;
  if (!src) return null;
  const isVideo = file ? fileKind(file) === "video" : undefined;

  if (file && isVideo) {
    return <video src={src} className={className} muted loop autoPlay playsInline />;
  }
  if (file) {
    return <img src={src} alt="" className={className} />;
  }
  return <MediaAsset src={src} alt="" className={className} />;
}

/** Drag-and-drop field for a single header/hero image or video. */
function SingleMediaField({ file, url, onFile, onUrl, onClear, accept }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const hasValue = Boolean(file || url);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onFile(dropped);
  };

  return (
    <div>
      <div
        className={`cms-dropzone${dragOver ? " cms-dropzone--over" : ""}${
          hasValue ? " cms-dropzone--filled" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !hasValue && inputRef.current?.click()}
      >
        {hasValue ? (
          <>
            <MediaPreview file={file} url={url} className="cms-dropzone-media" />
            <button
              type="button"
              className="cms-chip-remove cms-chip-remove--corner"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              aria-label="Remove"
            >
              ×
            </button>
            <button
              type="button"
              className="cms-dropzone-replace"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              Replace
            </button>
          </>
        ) : (
          <div className="cms-dropzone-empty">
            <strong>Drop image or video</strong>
            <span>or click to browse</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept || "image/*,video/*"}
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
      </div>
      <button
        type="button"
        className="cms-link-btn"
        onClick={() => setShowUrlInput((s) => !s)}
      >
        {showUrlInput ? "Hide URL field" : "…or paste a URL instead"}
      </button>
      {showUrlInput && (
        <input
          className="cms-text-input"
          placeholder="https://res.cloudinary.com/..."
          value={file ? "" : url || ""}
          onChange={(e) => onUrl(e.target.value)}
        />
      )}
    </div>
  );
}

/** Grid of gallery entries (existing URLs + newly picked files) with add/remove. */
function GalleryField({ entries, onAdd, onRemove }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");

  const addFiles = (fileList) => {
    [...fileList].forEach((f) => onAdd({ id: makeId(), kind: "file", file: f }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const addUrl = () => {
    const v = urlDraft.trim();
    if (!v) return;
    onAdd({ id: makeId(), kind: "url", url: v });
    setUrlDraft("");
  };

  return (
    <div>
      <div
        className={`cms-gallery${dragOver ? " cms-gallery--over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {entries.map((entry) => (
          <div className="cms-gallery-tile" key={entry.id}>
            <MediaPreview
              file={entry.kind === "file" ? entry.file : null}
              url={entry.kind === "url" ? entry.url : null}
              className="cms-gallery-media"
            />
            <button
              type="button"
              className="cms-chip-remove cms-chip-remove--corner"
              onClick={() => onRemove(entry.id)}
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="cms-gallery-add"
          onClick={() => inputRef.current?.click()}
        >
          + Add
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      <div className="cms-gallery-urlrow">
        <input
          className="cms-text-input"
          placeholder="Paste an image/video URL, then Add"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
        />
        <button type="button" className="cms-ghost-btn" onClick={addUrl}>
          Add
        </button>
      </div>
    </div>
  );
}

function Toasts({ toasts, onDismiss }) {
  return (
    <div className="cms-toasts">
      {toasts.map((t) => (
        <div key={t.id} className={`cms-toast cms-toast--${t.kind}`}>
          <span>{t.text}</span>
          <button type="button" onClick={() => onDismiss(t.id)} aria-label="Dismiss">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AdminCmsPanel() {
  const [collectionId, setCollectionId] = useState("women");
  const meta = useMemo(
    () => COLLECTIONS.find((c) => c.id === collectionId),
    [collectionId]
  );
  const schema = meta?.schema || "product";
  const schemaMeta = SCHEMA_META[schema];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(null); // { done, total }
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [toasts, setToasts] = useState([]);
  const pushToast = useCallback((text, kind = "info") => {
    const id = makeId();
    setToasts((prev) => [...prev, { id, text, kind }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);
  const dismissToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [publishLocal, setPublishLocal] = useState(defaultDatetimeLocal);

  const [headerFile, setHeaderFile] = useState(null);
  const [headerUrl, setHeaderUrl] = useState("");
  const [gallery, setGallery] = useState([]); // [{id, kind:'url'|'file', url?, file?}]

  const resetForm = useCallback(() => {
    setEditingId(null);
    setName("");
    setPrice("");
    setDescription("");
    setHeaderFile(null);
    setHeaderUrl("");
    setGallery([]);
    setPublishLocal(defaultDatetimeLocal());
  }, []);

  useEffect(() => {
    resetForm();
    setSearch("");
  }, [collectionId, resetForm]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const cref = collection(db, collectionId);
      let snapshot;
      try {
        snapshot = await getDocs(query(cref, orderBy("publish_date", "desc")));
      } catch {
        snapshot = await getDocs(cref);
      }
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => {
        const ca = a.publish_date?.toMillis?.() ?? 0;
        const cb = b.publish_date?.toMillis?.() ?? 0;
        return cb - ca;
      });
      setItems(list);
    } catch (e) {
      pushToast(e.message || "Failed to load documents", "error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [collectionId, pushToast]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((row) => (row.name || "").toLowerCase().includes(q));
  }, [items, search]);

  const openCreate = () => {
    resetForm();
    setDrawerOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setName(row.name || "");
    setPrice(row.price != null ? String(row.price) : "");
    setDescription(row.description || "");
    setHeaderFile(null);
    setHeaderUrl(row.header_image || row.header_content || "");
    const existingGallery = row.product_images || row.images || [];
    setGallery(existingGallery.map((u) => ({ id: makeId(), kind: "url", url: u })));
    setPublishLocal(timestampToLocalInput(row.publish_date) || defaultDatetimeLocal());
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    resetForm();
  };

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  async function uploadAllWithProgress(files) {
    if (files.length === 0) return [];
    let done = 0;
    setProgress({ done, total: files.length });
    const urls = await Promise.all(
      files.map(async (f) => {
        const url = await uploadPublicMedia(f);
        done += 1;
        setProgress({ done, total: files.length });
        return url;
      })
    );
    setProgress(null);
    return urls;
  }

  async function resolveHeaderUrl() {
    if (headerFile) {
      const [url] = await uploadAllWithProgress([headerFile]);
      return url;
    }
    return headerUrl.trim();
  }

  async function resolveGalleryUrls() {
    const urlEntries = gallery.filter((g) => g.kind === "url").map((g) => g.url);
    const fileEntries = gallery.filter((g) => g.kind === "file").map((g) => g.file);
    const uploaded = await uploadAllWithProgress(fileEntries);
    return [...urlEntries, ...uploaded];
  }

  async function buildPayload() {
    const publish_date = localInputToTimestamp(publishLocal);
    const trimmedName = name.trim();
    const trimmedDesc = description.trim();

    if (schema === "introHero") {
      const header_content = await resolveHeaderUrl();
      if (!header_content) throw new Error("Add a hero file or paste a media URL.");
      const payload = { header_content, publish_date };
      if (trimmedName) payload.name = trimmedName;
      if (trimmedDesc) payload.description = trimmedDesc;
      return payload;
    }

    if (schema === "storeCard") {
      const header_image = await resolveHeaderUrl();
      if (!trimmedName) throw new Error("Name is required.");
      if (!header_image) throw new Error("Add an image/video file or paste a URL.");
      const payload = { name: trimmedName, header_image, publish_date };
      if (trimmedDesc) payload.description = trimmedDesc;
      return payload;
    }

    if (schema === "blogPost") {
      const header_image = await resolveHeaderUrl();
      if (!trimmedName) throw new Error("Name is required.");
      if (!header_image) throw new Error("Add a header file or paste a URL.");
      const images = await resolveGalleryUrls();
      const payload = { name: trimmedName, header_image, images, publish_date };
      if (trimmedDesc) payload.description = trimmedDesc;
      return payload;
    }

    // product
    const header_image = await resolveHeaderUrl();
    if (!trimmedName) throw new Error("Name is required.");
    const p = Number(price);
    if (Number.isNaN(p)) throw new Error("Price must be a number.");
    if (!header_image) throw new Error("Add a header file or paste a URL.");
    const product_images = await resolveGalleryUrls();
    const payload = {
      name: trimmedName,
      price: p,
      header_image,
      product_images,
      publish_date,
    };
    if (trimmedDesc) payload.description = trimmedDesc;
    return payload;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const needsUpload =
      Boolean(headerFile) || gallery.some((g) => g.kind === "file");
    if (needsUpload && !canPerformBinaryUpload()) {
      pushToast(
        "Configure a Cloudinary preset (or Firebase Storage bucket) before uploading files.",
        "error"
      );
      return;
    }
    setSaving(true);
    try {
      const payload = await buildPayload();
      if (editingId) {
        await updateDoc(doc(db, collectionId, editingId), payload);
        pushToast("Saved changes.", "success");
      } else {
        await addDoc(collection(db, collectionId), payload);
        pushToast("Published.", "success");
      }
      closeDrawer();
      loadItems();
    } catch (err) {
      pushToast(err.message || "Save failed", "error");
    } finally {
      setSaving(false);
      setProgress(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, collectionId, id));
      pushToast("Deleted.", "success");
      if (editingId === id) closeDrawer();
      setConfirmDeleteId(null);
      loadItems();
    } catch (err) {
      pushToast(err.message || "Delete failed", "error");
    }
  };

  return (
    <div className="admin-tw-root cms-root">
      <Toasts toasts={toasts} onDismiss={dismissToast} />

      <div className="cms-tabs">
        {COLLECTIONS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`cms-tab${c.id === collectionId ? " cms-tab--active" : ""}`}
            onClick={() => setCollectionId(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="cms-toolbar">
        <input
          className="cms-text-input cms-search"
          placeholder={`Search ${meta?.label.toLowerCase()}…`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="cms-toolbar-actions">
          <button type="button" className="cms-ghost-btn" onClick={loadItems} disabled={loading}>
            Refresh
          </button>
          <button type="button" className="cms-primary-btn" onClick={openCreate}>
            + Add {schemaMeta.badge.toLowerCase()}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="cms-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="cms-card cms-card--skeleton" key={i} />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="cms-empty">
          <strong>No items yet</strong>
          <span>Add your first {schemaMeta.badge.toLowerCase()} to {meta?.label}.</span>
        </div>
      ) : (
        <div className="cms-grid">
          {filteredItems.map((row) => {
            const thumb =
              row.header_image || row.header_content || (row.images && row.images[0]) || "";
            const galleryCount = (row.product_images || row.images || []).length;
            return (
              <div className="cms-card" key={row.id}>
                <div className="cms-card-media">
                  <MediaAsset src={thumb} alt="" className="cms-card-thumb" videoControls={false} />
                  {galleryCount > 0 && (
                    <span className="cms-card-gallery-badge">+{galleryCount} more</span>
                  )}
                </div>
                <div className="cms-card-body">
                  <div className="cms-card-title-row">
                    <strong className="cms-card-title">{row.name || "Untitled"}</strong>
                    {row.price != null && (
                      <span className="cms-card-price">{formatKsh(row.price)}</span>
                    )}
                  </div>
                  {row.description && (
                    <p className="cms-card-desc">{row.description}</p>
                  )}
                </div>
                <div className="cms-card-actions">
                  {confirmDeleteId === row.id ? (
                    <>
                      <button
                        type="button"
                        className="cms-danger-btn"
                        onClick={() => handleDelete(row.id)}
                      >
                        Confirm delete
                      </button>
                      <button
                        type="button"
                        className="cms-ghost-btn"
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="cms-ghost-btn" onClick={() => openEdit(row)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="cms-danger-btn"
                        onClick={() => setConfirmDeleteId(row.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {drawerOpen && (
        <>
          <button
            type="button"
            className="cms-backdrop"
            aria-label="Close"
            onClick={closeDrawer}
          />
          <aside className="cms-drawer">
            <div className="cms-drawer-head">
              <h3>{editingId ? `Edit ${schemaMeta.badge.toLowerCase()}` : `Add ${schemaMeta.badge.toLowerCase()}`}</h3>
              <button type="button" className="cms-chip-remove" onClick={closeDrawer} aria-label="Close">
                ×
              </button>
            </div>

            <form className="cms-form" onSubmit={handleSubmit}>
              {schema !== "introHero" && (
                <label className="cms-field">
                  <span>Title / name</span>
                  <input
                    className="cms-text-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Displayed on the storefront"
                    required
                  />
                </label>
              )}
              {schema === "introHero" && (
                <label className="cms-field">
                  <span>Internal label (optional)</span>
                  <input
                    className="cms-text-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Homepage hero — spring"
                  />
                </label>
              )}

              {schemaMeta.hasPrice && (
                <label className="cms-field">
                  <span>Price</span>
                  <div className="cms-price-input">
                    <span>Ksh</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                </label>
              )}

              <label className="cms-field">
                <span>{schema === "blogPost" ? "Description" : "Description / notes (optional)"}</span>
                <textarea
                  className="cms-text-input"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    schema === "blogPost"
                      ? "Shown under the slideshow on /blog"
                      : "Internal notes or storefront copy"
                  }
                />
              </label>

              <label className="cms-field">
                <span>Publish date</span>
                <input
                  type="datetime-local"
                  className="cms-text-input"
                  value={publishLocal}
                  onChange={(e) => setPublishLocal(e.target.value)}
                  required
                />
              </label>

              <div className="cms-field">
                <span>{schema === "introHero" ? "Hero media" : "Header image / video"}</span>
                <SingleMediaField
                  file={headerFile}
                  url={headerUrl}
                  onFile={(f) => {
                    setHeaderFile(f);
                    setHeaderUrl("");
                  }}
                  onUrl={(v) => {
                    setHeaderUrl(v);
                    setHeaderFile(null);
                  }}
                  onClear={() => {
                    setHeaderFile(null);
                    setHeaderUrl("");
                  }}
                />
              </div>

              {schemaMeta.hasGallery && (
                <div className="cms-field">
                  <span>Gallery ({gallery.length} image{gallery.length === 1 ? "" : "s"})</span>
                  <GalleryField
                    entries={gallery}
                    onAdd={(entry) => setGallery((prev) => [...prev, entry])}
                    onRemove={(id) => setGallery((prev) => prev.filter((g) => g.id !== id))}
                  />
                </div>
              )}

              {progress && (
                <div className="cms-progress">
                  Uploading {progress.done}/{progress.total}…
                  <div className="cms-progress-bar">
                    <div
                      className="cms-progress-fill"
                      style={{ width: `${(progress.done / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="cms-drawer-actions">
                <button type="submit" className="cms-primary-btn" disabled={saving}>
                  {saving ? "Saving…" : editingId ? "Save changes" : "Publish"}
                </button>
                <button type="button" className="cms-ghost-btn" onClick={closeDrawer}>
                  Cancel
                </button>
              </div>
            </form>
          </aside>
        </>
      )}
    </div>
  );
}
