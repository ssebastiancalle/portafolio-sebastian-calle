"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import imageCompression from "browser-image-compression";
import exifr from "exifr";
import { showToast } from "nextjs-toast-notify";

type ExifData = {
  taken_at?: string;
  lat?: number;
  lng?: number;
  altitude?: number;
  camera_make?: string;
  camera_model?: string;
  width?: number;
  height?: number;
  exif_raw?: Record<string, unknown>;
};

type PreviewFile = {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "compressing" | "uploading" | "done" | "error";
  url?: string;
  exif?: ExifData;
};

export default function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [phase, setPhase] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [globalError, setGlobalError] = useState("");

  function addFiles(raw: FileList | null) {
    if (!raw) return;
    const next: PreviewFile[] = Array.from(raw).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...next]);
  }

  function removeFile(id: string) {
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f) URL.revokeObjectURL(f.preview);
      return prev.filter((x) => x.id !== id);
    });
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }, []);

  function setFileStatus(id: string, patch: Partial<PreviewFile>) {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  async function handleUpload() {
    if (!albumName.trim() || files.length === 0) return;
    setPhase("processing");
    setGlobalError("");

    type UploadedPhoto = { url: string; storagePath: string; filename: string; exif?: ExifData };
    const uploaded: UploadedPhoto[] = [];

    for (const f of files) {
      // 1. Extract EXIF from original before any conversion
      let exif: ExifData | undefined;
      try {
        const raw = await exifr.parse(f.file, {
          tiff: true, exif: true, gps: true, icc: false, iptc: false, xmp: false,
        });
        if (raw) {
          exif = {
            taken_at: raw.DateTimeOriginal?.toISOString?.() ?? raw.CreateDate?.toISOString?.(),
            lat: raw.latitude,
            lng: raw.longitude,
            altitude: raw.GPSAltitude,
            camera_make: raw.Make,
            camera_model: raw.Model,
            width: raw.ImageWidth ?? raw.ExifImageWidth,
            height: raw.ImageHeight ?? raw.ExifImageHeight,
            exif_raw: raw,
          };
        }
      } catch {
        // EXIF extraction is best-effort — continue without it
      }

      // 2. Compress to WebP
      setFileStatus(f.id, { status: "compressing" });
      let compressed: File;
      try {
        compressed = await imageCompression(f.file, {
          maxSizeMB: 8,
          maxWidthOrHeight: 3200,
          fileType: "image/webp",
          initialQuality: 0.95,
          useWebWorker: true,
        });
      } catch {
        setFileStatus(f.id, { status: "error" });
        setGlobalError(`Error al comprimir "${f.file.name}"`);
        setPhase("error");
        return;
      }

      // Always measure actual pixel dimensions from the compressed file
      const actualDims = await new Promise<{ width: number; height: number }>((resolve) => {
        const img = document.createElement("img");
        const url = URL.createObjectURL(compressed);
        img.onload = () => { resolve({ width: img.naturalWidth, height: img.naturalHeight }); URL.revokeObjectURL(url); };
        img.onerror = () => { resolve({ width: 0, height: 0 }); URL.revokeObjectURL(url); };
        img.src = url;
      });
      exif = { ...exif, width: actualDims.width || exif?.width, height: actualDims.height || exif?.height };

      // 3. Upload
      setFileStatus(f.id, { status: "uploading" });
      const form = new FormData();
      form.append("photo", compressed, compressed.name);
      try {
        const res = await fetch("/api/upload/photo", { method: "POST", body: form });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Upload failed");
        }
        const { url, storagePath, filename } = await res.json();
        setFileStatus(f.id, { status: "done", url, exif });
        uploaded.push({ url, storagePath, filename, exif });
      } catch (err: unknown) {
        setFileStatus(f.id, { status: "error" });
        const msg = err instanceof Error ? err.message : "Error al subir foto";
        setFileStatus(f.id, { status: "error" });
        showToast.error(msg, { duration: 5000, sound: true, position: "bottom-right" });
        setPhase("error");
        return;
      }
    }

    // 4. Create album
    try {
      const res = await fetch("/api/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: albumName.trim(), description: albumDescription.trim() || undefined, photos: uploaded }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al crear álbum");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al crear álbum";
      showToast.error(msg, { duration: 5000, sound: true, position: "bottom-right" });
      setPhase("error");
      return;
    }

    showToast.success(`Álbum "${albumName.trim()}" creado`, { duration: 4000, sound: true, position: "bottom-right" });
    setPhase("done");
  }

  const doneCount = files.filter((f) => f.status === "done").length;
  const isProcessing = phase === "processing";
  const canSubmit = albumName.trim().length > 0 && files.length > 0 && !isProcessing;

  if (phase === "done") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: "var(--bg)" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-3)" }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase" style={{ color: "var(--text-3)" }}>
          Álbum creado
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => { setFiles([]); setAlbumName(""); setPhase("idle"); }}
            className="px-6 py-3 font-mono text-[10px] tracking-[0.3em] uppercase border transition-opacity hover:opacity-60"
            style={{ borderColor: "var(--border-2)", color: "var(--text-3)" }}
          >
            Subir otro
          </button>
          <Link
            href="/admin"
            className="px-6 py-3 font-mono text-[10px] tracking-[0.3em] uppercase transition-opacity hover:opacity-70"
            style={{ background: "var(--text)", color: "var(--bg)" }}
          >
            Volver
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 md:px-10 h-14 border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
      >
        <Link
          href="/admin"
          className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase transition-opacity hover:opacity-60"
          style={{ color: "var(--text-3)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </Link>
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: "var(--text-3)" }}>
          Nuevo álbum
        </p>
        <div className="w-16" />
      </div>

      <div className="max-w-2xl mx-auto px-6 md:px-10 py-10 flex flex-col gap-8">
        {/* Album name */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text-3)" }}>
            Nombre del álbum
          </label>
          <input
            type="text"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            disabled={isProcessing}
            className="w-full px-4 py-3 font-mono text-sm outline-none disabled:opacity-40"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-2)",
              color: "var(--text)",
            }}
            placeholder="ej: Retratos · Buenos Aires"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text-3)" }}>
            Descripción <span style={{ color: "var(--text-4)" }}>(opcional)</span>
          </label>
          <textarea
            value={albumDescription}
            onChange={(e) => setAlbumDescription(e.target.value)}
            disabled={isProcessing}
            rows={3}
            className="w-full px-4 py-3 font-mono text-sm outline-none resize-none disabled:opacity-40"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-2)",
              color: "var(--text)",
            }}
            placeholder="Pie de álbum..."
          />
        </div>

        {/* Drop zone */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !isProcessing && inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 py-12 border-2 border-dashed transition-colors"
          style={{
            borderColor: "var(--border-2)",
            cursor: isProcessing ? "default" : "pointer",
            opacity: isProcessing ? 0.5 : 1,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-3)" }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text-3)" }}>
            Arrastrá o hacé clic para seleccionar
          </p>
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: "var(--text-4)" }}>
            JPG · PNG · WEBP — se comprimen automáticamente
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {/* Previews grid */}
        {files.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {files.map((f) => (
              <div key={f.id} className="relative aspect-square overflow-hidden group" style={{ background: "var(--bg-surface)" }}>
                <Image src={f.preview} alt={f.file.name} fill className="object-cover" sizes="150px" />

                {/* Status overlay */}
                {f.status !== "pending" && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.55)" }}>
                    {(f.status === "compressing" || f.status === "uploading") && (
                      <div className="flex flex-col items-center gap-1">
                        <SpinnerIcon />
                        <span className="font-mono text-[8px] tracking-widest uppercase text-white/70">
                          {f.status === "compressing" ? "Comprimiendo" : "Subiendo"}
                        </span>
                      </div>
                    )}
                    {f.status === "done" && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {f.status === "error" && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e05c5c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    )}
                  </div>
                )}

                {/* Remove button — only when not processing */}
                {!isProcessing && f.status === "pending" && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                    className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(0,0,0,0.7)" }}
                    aria-label="Eliminar foto"
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Progress text */}
        {isProcessing && (
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text-3)" }}>
            {doneCount} / {files.length} fotos subidas...
          </p>
        )}

        {/* Error */}
        {globalError && (
          <p className="font-mono text-[11px] tracking-wide" style={{ color: "#e05c5c" }}>
            {globalError}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleUpload}
          disabled={!canSubmit}
          className="w-full py-4 font-mono text-[11px] tracking-[0.3em] uppercase transition-opacity disabled:opacity-30"
          style={{ background: "var(--text)", color: "var(--bg)" }}
        >
          {isProcessing ? `Subiendo ${doneCount}/${files.length}...` : "Crear álbum"}
        </button>
      </div>
    </div>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2" strokeLinecap="round"
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
