import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { uploadService } from '../../services/uploadService';
import { getApiErrorMessage } from '../../services/api';
import type { Category, FragranceFamily, Gender, CollectionName, Product } from '../../types';
import { usePageMeta } from '../../utils/usePageMeta';
import { useToast } from '../../components/ToastHost';
import TagInput from '../../components/TagInput';
import LoadingSpinner from '../../components/LoadingSpinner';

const GENDERS: Gender[] = ['Men', 'Women', 'Unisex'];
const COLLECTIONS: CollectionName[] = ['Eclipse', 'Signature', 'Midnight', 'Essence'];
const CATEGORIES: Category[] = ['Men', 'Women', 'Unisex', 'Premium', 'Gift Sets'];
const FAMILIES: FragranceFamily[] = ['Fresh', 'Floral', 'Woody', 'Oud', 'Musky', 'Sweet', 'Citrus', 'Oriental'];
const LONGEVITY_OPTIONS = ['Weak', 'Moderate', 'Long Lasting', 'Very Long Lasting'];
const SILLAGE_OPTIONS = ['Intimate', 'Moderate', 'Strong', 'Enormous'];
const OCCASION_OPTIONS = ['Casual', 'Office', 'Evening', 'Formal', 'Date Night', 'Party'];
const SEASON_OPTIONS = ['Spring', 'Summer', 'Autumn', 'Winter', 'All Season'];

interface FormState {
  name: string;
  description: string;
  price: string;
  gender: Gender;
  collectionName: CollectionName;
  category: Category;
  fragranceFamily: FragranceFamily;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  longevity: string;
  sillage: string;
  occasion: string[];
  season: string[];
  size: string;
  stock: string;
  featured: boolean;
  bestseller: boolean;
  isNewArrival: boolean;
  images: string[];
}

const emptyForm: FormState = {
  name: '',
  description: '',
  price: '',
  gender: 'Unisex',
  collectionName: 'Signature',
  category: 'Unisex',
  fragranceFamily: 'Woody',
  topNotes: [],
  heartNotes: [],
  baseNotes: [],
  longevity: 'Moderate',
  sillage: 'Moderate',
  occasion: [],
  season: [],
  size: '50ml',
  stock: '0',
  featured: false,
  bestseller: false,
  isNewArrival: false,
  images: [],
};

function productToForm(p: Product): FormState {
  return {
    name: p.name,
    description: p.description,
    price: String(p.price),
    gender: p.gender,
    collectionName: p.collectionName,
    category: p.category,
    fragranceFamily: p.fragranceFamily,
    topNotes: p.topNotes ?? [],
    heartNotes: p.heartNotes ?? [],
    baseNotes: p.baseNotes ?? [],
    longevity: p.longevity ?? 'Moderate',
    sillage: p.sillage ?? 'Moderate',
    occasion: p.occasion ?? [],
    season: p.season ?? [],
    size: p.size ?? '50ml',
    stock: String(p.stock ?? 0),
    featured: p.featured,
    bestseller: p.bestseller,
    isNewArrival: p.isNewArrival,
    images: p.images ?? [],
  };
}

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  usePageMeta(isEdit ? 'Edit Product' : 'New Product', 'Manage NB Classic Scents product details.');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    productService
      .getOne(id)
      .then((p) => setForm(productToForm(p)))
      .catch((err) => setError(getApiErrorMessage(err, 'Unable to load this product.')))
      .finally(() => setLoading(false));
  }, [id]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const paths = await uploadService.uploadImages(Array.from(files).slice(0, 6));
      set('images', [...form.images, ...paths]);
      showToast('Images uploaded.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to upload images.'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim() || !form.price) {
      setError('Name, description, and price are required.');
      return;
    }
    setSaving(true);
    setError(null);
    const payload: Partial<Product> = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      gender: form.gender,
      collectionName: form.collectionName,
      category: form.category,
      fragranceFamily: form.fragranceFamily,
      topNotes: form.topNotes,
      heartNotes: form.heartNotes,
      baseNotes: form.baseNotes,
      longevity: form.longevity,
      sillage: form.sillage,
      occasion: form.occasion,
      season: form.season,
      size: form.size,
      stock: Number(form.stock) || 0,
      featured: form.featured,
      bestseller: form.bestseller,
      isNewArrival: form.isNewArrival,
      images: form.images,
    };
    try {
      if (isEdit && id) {
        await productService.update(id, payload);
        showToast('Product updated.');
      } else {
        await productService.create(payload);
        showToast('Product created.');
      }
      navigate('/admin/products');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to save this product.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading product" dark />;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl md:text-3xl text-cocoa mb-8">{isEdit ? 'Edit Product' : 'New Product'}</h1>

      <form onSubmit={submit} className="space-y-6">
        <div className="bg-white border border-cocoa/10 rounded-sm p-6 space-y-4">
          <h2 className="font-display text-lg text-cocoa">Basic Information</h2>
          <div>
            <label className="label-field">Name</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="label-field">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} className="input-field resize-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Price (Rs.)</label>
              <input type="number" min={0} value={form.price} onChange={(e) => set('price', e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="label-field">Stock</label>
              <input type="number" min={0} value={form.stock} onChange={(e) => set('stock', e.target.value)} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Size</label>
              <input value={form.size} onChange={(e) => set('size', e.target.value)} className="input-field" placeholder="50ml" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-cocoa/10 rounded-sm p-6 space-y-4">
          <h2 className="font-display text-lg text-cocoa">Classification</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Gender</label>
              <select value={form.gender} onChange={(e) => set('gender', e.target.value as Gender)} className="input-field">
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Category</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value as Category)} className="input-field">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Collection</label>
              <select value={form.collectionName} onChange={(e) => set('collectionName', e.target.value as CollectionName)} className="input-field">
                {COLLECTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Fragrance Family</label>
              <select value={form.fragranceFamily} onChange={(e) => set('fragranceFamily', e.target.value as FragranceFamily)} className="input-field">
                {FAMILIES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Longevity</label>
              <select value={form.longevity} onChange={(e) => set('longevity', e.target.value)} className="input-field">
                {LONGEVITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Sillage</label>
              <select value={form.sillage} onChange={(e) => set('sillage', e.target.value)} className="input-field">
                {SILLAGE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label-field">Occasion</label>
            <div className="flex flex-wrap gap-2">
              {OCCASION_OPTIONS.map((o) => {
                const active = form.occasion.includes(o);
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() => set('occasion', toggleInArray(form.occasion, o))}
                    className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors ${active ? 'bg-midnight-navy text-champagne border-midnight-navy' : 'border-cocoa/20 text-cocoa/70'}`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="label-field">Season</label>
            <div className="flex flex-wrap gap-2">
              {SEASON_OPTIONS.map((s) => {
                const active = form.season.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set('season', toggleInArray(form.season, s))}
                    className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors ${active ? 'bg-midnight-navy text-champagne border-midnight-navy' : 'border-cocoa/20 text-cocoa/70'}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white border border-cocoa/10 rounded-sm p-6 space-y-4">
          <h2 className="font-display text-lg text-cocoa">Fragrance Notes</h2>
          <TagInput label="Top Notes" values={form.topNotes} onChange={(v) => set('topNotes', v)} />
          <TagInput label="Heart Notes" values={form.heartNotes} onChange={(v) => set('heartNotes', v)} />
          <TagInput label="Base Notes" values={form.baseNotes} onChange={(v) => set('baseNotes', v)} />
        </div>

        <div className="bg-white border border-cocoa/10 rounded-sm p-6 space-y-4">
          <h2 className="font-display text-lg text-cocoa">Images</h2>
          <div className="flex flex-wrap gap-3">
            {form.images.map((img) => (
              <div key={img} className="relative h-20 w-20">
                <img src={img} alt="Product" className="h-full w-full object-cover rounded-sm" />
                <button
                  type="button"
                  onClick={() => set('images', form.images.filter((i) => i !== img))}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-espresso text-ivory text-xs flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="text-sm"
            disabled={uploading || form.images.length >= 6}
          />
          {uploading && <p className="text-xs text-cocoa/50">Uploading...</p>}
          <p className="text-xs text-cocoa/40">Up to 6 images.</p>
        </div>

        <div className="bg-white border border-cocoa/10 rounded-sm p-6">
          <h2 className="font-display text-lg text-cocoa mb-4">Highlights</h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-cocoa">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="accent-champagne h-4 w-4" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-cocoa">
              <input type="checkbox" checked={form.bestseller} onChange={(e) => set('bestseller', e.target.checked)} className="accent-champagne h-4 w-4" />
              Bestseller
            </label>
            <label className="flex items-center gap-2 text-sm text-cocoa">
              <input type="checkbox" checked={form.isNewArrival} onChange={(e) => set('isNewArrival', e.target.checked)} className="accent-champagne h-4 w-4" />
              New Arrival
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-rose-champagne">{error}</p>}

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline-dark">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
