import React, { useEffect, useRef, useState } from 'react';
import { HERO_SLIDES } from '../../data/heroSlides';
import { heroSlideService } from '../../services/heroSlideService';
import { uploadService } from '../../services/uploadService';
import { getApiErrorMessage } from '../../services/api';
import { usePageMeta } from '../../utils/usePageMeta';
import { useToast } from '../../components/ToastHost';
import LoadingSpinner from '../../components/LoadingSpinner';

function SlideCard({
  slideKey,
  label,
  defaultImage,
  currentImage,
  onChange,
}: {
  slideKey: string;
  label: string;
  defaultImage: string;
  currentImage?: string;
  onChange: (key: string, image: string | null) => void;
}) {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isCustom = Boolean(currentImage);

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const [path] = await uploadService.uploadImages([file]);
      const updated = await heroSlideService.update(slideKey, path);
      onChange(slideKey, updated.image);
      showToast(`${label} hero photo updated.`);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to upload this photo.'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const resetToDefault = async () => {
    setUploading(true);
    setError(null);
    try {
      await heroSlideService.remove(slideKey);
      onChange(slideKey, null);
      showToast(`${label} reverted to the default photo.`);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to reset this photo.'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white border border-cocoa/10 rounded-sm p-5 flex flex-col sm:flex-row gap-5">
      <div className="h-36 w-32 shrink-0 rounded-sm overflow-hidden bg-beige border border-cocoa/10">
        <img src={currentImage ?? defaultImage} alt={`${label} hero preview`} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3 className="font-display text-lg text-cocoa">{label}</h3>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide ${
              isCustom ? 'bg-champagne/15 text-cocoa' : 'bg-cocoa/5 text-cocoa/50'
            }`}
          >
            {isCustom ? 'Custom photo' : 'Default artwork'}
          </span>
        </div>
        <p className="text-xs text-cocoa/50 mt-1.5">
          Upload a photo to replace this slide&rsquo;s hero image on the homepage.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files)}
            disabled={uploading}
            className="text-xs"
          />
          {isCustom && (
            <button
              type="button"
              onClick={resetToDefault}
              disabled={uploading}
              className="text-[11px] uppercase tracking-wide text-cocoa/60 hover:text-champagne disabled:opacity-40"
            >
              Reset to Default
            </button>
          )}
        </div>
        {uploading && <p className="text-xs text-cocoa/50 mt-2">Saving...</p>}
        {error && <p className="text-xs text-rose-champagne mt-2">{error}</p>}
      </div>
    </div>
  );
}

export default function AdminHomepage() {
  usePageMeta('Homepage', 'Manage the NB Classic Scents homepage hero photos.');
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    heroSlideService
      .getAll()
      .then(setOverrides)
      .catch((err) => setError(getApiErrorMessage(err, 'Unable to load homepage settings.')))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, image: string | null) => {
    setOverrides((prev) => {
      const next = { ...prev };
      if (image) next[key] = image;
      else delete next[key];
      return next;
    });
  };

  if (loading) return <LoadingSpinner label="Loading homepage settings" dark />;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl md:text-3xl text-cocoa mb-2">Homepage</h1>
      <p className="text-sm text-cocoa/60 mb-8">
        Replace the photo shown for each hero carousel slide on the homepage. Sizes, wording, and the rest of the site
        are unaffected.
      </p>

      {error && <p className="text-sm text-rose-champagne mb-4">{error}</p>}

      <div className="space-y-4">
        {HERO_SLIDES.map((s) => (
          <SlideCard
            key={s.key}
            slideKey={s.key}
            label={s.collection}
            defaultImage={s.bottle}
            currentImage={overrides[s.key]}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
}
