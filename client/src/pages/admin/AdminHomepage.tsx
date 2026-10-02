import React, { useEffect, useRef, useState } from 'react';
import { HERO_SLIDES } from '../../data/heroSlides';
import { heroSlideService, type HeroSlideField, type HeroSlideOverride } from '../../services/heroSlideService';
import { uploadService } from '../../services/uploadService';
import { getApiErrorMessage } from '../../services/api';
import { usePageMeta } from '../../utils/usePageMeta';
import { useToast } from '../../components/ToastHost';
import LoadingSpinner from '../../components/LoadingSpinner';

function PhotoField({
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
      const updated = await heroSlideService.update(slideKey, { image: path });
      onChange(slideKey, updated.image ?? path);
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
      await heroSlideService.remove(slideKey, 'image');
      onChange(slideKey, null);
      showToast(`${label} reverted to the default photo.`);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to reset this photo.'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-5">
      <div className="h-36 w-32 shrink-0 rounded-sm overflow-hidden bg-beige border border-cocoa/10">
        <img src={currentImage ?? defaultImage} alt={`${label} hero preview`} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h4 className="text-xs uppercase tracking-wide text-cocoa/70">Photo</h4>
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

function TextField({
  slideKey,
  slideLabel,
  field,
  fieldLabel,
  helperText,
  multiline,
  defaultValue,
  currentValue,
  onChange,
}: {
  slideKey: string;
  slideLabel: string;
  field: HeroSlideField;
  fieldLabel: string;
  helperText: string;
  multiline?: boolean;
  defaultValue: string;
  currentValue?: string;
  onChange: (key: string, field: HeroSlideField, value: string | null) => void;
}) {
  const { showToast } = useToast();
  const [draft, setDraft] = useState(currentValue ?? defaultValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isCustom = Boolean(currentValue);
  const activeText = currentValue ?? defaultValue;
  const isDirty = draft.trim() !== '' && draft !== activeText;

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await heroSlideService.update(slideKey, { [field]: draft.trim() });
      onChange(slideKey, field, updated[field] ?? draft.trim());
      showToast(`${slideLabel} ${fieldLabel.toLowerCase()} updated.`);
    } catch (err) {
      setError(getApiErrorMessage(err, `Unable to save this ${fieldLabel.toLowerCase()}.`));
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = async () => {
    setSaving(true);
    setError(null);
    try {
      await heroSlideService.remove(slideKey, field);
      setDraft(defaultValue);
      onChange(slideKey, field, null);
      showToast(`${slideLabel} ${fieldLabel.toLowerCase()} reverted to the default.`);
    } catch (err) {
      setError(getApiErrorMessage(err, `Unable to reset this ${fieldLabel.toLowerCase()}.`));
    } finally {
      setSaving(false);
    }
  };

  const InputTag = multiline ? 'textarea' : 'input';

  return (
    <div className="pt-5 mt-5 border-t border-cocoa/10">
      <div className="flex items-center gap-2.5 flex-wrap">
        <h4 className="text-xs uppercase tracking-wide text-cocoa/70">{fieldLabel}</h4>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide ${
            isCustom ? 'bg-champagne/15 text-cocoa' : 'bg-cocoa/5 text-cocoa/50'
          }`}
        >
          {isCustom ? 'Custom text' : 'Default text'}
        </span>
      </div>
      <p className="text-xs text-cocoa/50 mt-1.5">{helperText}</p>

      <InputTag
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        disabled={saving}
        rows={multiline ? 3 : undefined}
        className="input-field mt-3 w-full text-sm resize-y"
      />

      <div className="flex flex-wrap items-center gap-3 mt-3">
        <button
          type="button"
          onClick={save}
          disabled={saving || !isDirty}
          className="btn-outline-dark text-[11px] px-4 py-2 disabled:opacity-40"
        >
          Save {fieldLabel}
        </button>
        {isCustom && (
          <button
            type="button"
            onClick={resetToDefault}
            disabled={saving}
            className="text-[11px] uppercase tracking-wide text-cocoa/60 hover:text-champagne disabled:opacity-40"
          >
            Reset to Default
          </button>
        )}
      </div>
      {saving && <p className="text-xs text-cocoa/50 mt-2">Saving...</p>}
      {error && <p className="text-xs text-rose-champagne mt-2">{error}</p>}
    </div>
  );
}

export default function AdminHomepage() {
  usePageMeta('Homepage', 'Manage the NB Classic Scents homepage hero photos, names and description text.');
  const [overrides, setOverrides] = useState<Record<string, HeroSlideOverride>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    heroSlideService
      .getAll()
      .then(setOverrides)
      .catch((err) => setError(getApiErrorMessage(err, 'Unable to load homepage settings.')))
      .finally(() => setLoading(false));
  }, []);

  const handleImageChange = (key: string, image: string | null) => {
    setOverrides((prev) => {
      const next = { ...prev, [key]: { ...prev[key] } };
      if (image) next[key].image = image;
      else delete next[key].image;
      if (!next[key].image && !next[key].headline && !next[key].description) delete next[key];
      return next;
    });
  };

  const handleTextChange = (key: string, field: HeroSlideField, value: string | null) => {
    if (field === 'image') return;
    setOverrides((prev) => {
      const next = { ...prev, [key]: { ...prev[key] } };
      if (value) next[key][field] = value;
      else delete next[key][field];
      if (!next[key].image && !next[key].headline && !next[key].description) delete next[key];
      return next;
    });
  };

  if (loading) return <LoadingSpinner label="Loading homepage settings" dark />;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl md:text-3xl text-cocoa mb-2">Homepage</h1>
      <p className="text-sm text-cocoa/60 mb-8">
        Replace the photo, name and/or description shown for each hero carousel slide on the homepage. For Eclipse,
        Signature, Midnight and Essence, the same photo also replaces that collection&rsquo;s tile further down the
        homepage. Sizes, wording elsewhere, and the rest of the site are unaffected.
      </p>

      {error && <p className="text-sm text-rose-champagne mb-4">{error}</p>}

      <div className="space-y-4">
        {HERO_SLIDES.map((s) => (
          <div key={s.key} className="bg-white border border-cocoa/10 rounded-sm p-5">
            <h3 className="font-display text-lg text-cocoa mb-4">{s.collection}</h3>
            <PhotoField
              slideKey={s.key}
              label={s.collection}
              defaultImage={s.bottle}
              currentImage={overrides[s.key]?.image}
              onChange={handleImageChange}
            />
            <TextField
              slideKey={s.key}
              slideLabel={s.collection}
              field="headline"
              fieldLabel="Name"
              helperText="The large perfume name shown on this hero slide."
              defaultValue={s.headline}
              currentValue={overrides[s.key]?.headline}
              onChange={handleTextChange}
            />
            <TextField
              slideKey={s.key}
              slideLabel={s.collection}
              field="description"
              fieldLabel="Description"
              helperText="The body copy shown under this slide's headline on the homepage."
              multiline
              defaultValue={s.description}
              currentValue={overrides[s.key]?.description}
              onChange={handleTextChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
