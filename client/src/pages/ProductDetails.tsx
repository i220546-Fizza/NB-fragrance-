import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { getApiErrorMessage } from '../services/api';
import type { Product } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { usePageMeta } from '../utils/usePageMeta';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastHost';
import QuantitySelector from '../components/QuantitySelector';
import SizeSelector from '../components/SizeSelector';
import StarRating from '../components/StarRating';
import NotesDiagram from '../components/NotesDiagram';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorNotice from '../components/ErrorNotice';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';

function TagChips({ label, items }: { label: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="text-xs tracking-wide uppercase text-cocoa/45 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <span key={it} className="text-[11px] px-3 py-1 rounded-full bg-warm-cream text-cocoa/70">
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { idOrSlug = '' } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  usePageMeta(product?.name ?? 'Product', product?.description?.slice(0, 155));

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    productService
      .getOne(idOrSlug)
      .then((p) => {
        setProduct(p);
        setActiveImage(0);
        setQty(1);
        setSelectedSize(null);
        setSizeError(false);
        return productService.related(p._id).catch(() => []);
      })
      .then((rel) => setRelated(rel))
      .catch((err) => setError(getApiErrorMessage(err, 'This fragrance could not be found.')))
      .finally(() => setLoading(false));
  }, [idOrSlug]);

  useEffect(() => {
    load();
    window.scrollTo({ top: 0 });
  }, [load]);

  if (loading) {
    return (
      <div className="pt-24">
        <LoadingSpinner label="Loading fragrance" dark />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-24">
        <ErrorNotice message={error ?? 'This fragrance could not be found.'} onRetry={load} />
      </div>
    );
  }

  const images = product.images?.length ? product.images : ['/images/product-placeholder.svg'];
  const wished = isWishlisted(product._id);
  const selectedSizeOption = product.sizes.find((s) => s.size === selectedSize);
  const displayPrice = selectedSizeOption?.price ?? product.price;

  const addToCart = (andCheckout: boolean) => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addItem(product, selectedSize, qty);
    if (andCheckout) {
      navigate('/checkout');
    } else {
      showToast('Added to your collection.');
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setReviewError('Please share a few words about this fragrance.');
      return;
    }
    setSubmittingReview(true);
    setReviewError(null);
    try {
      await productService.addReview(product._id, { rating: reviewRating, comment: reviewComment.trim() });
      showToast('Thank you for your review.');
      setReviewComment('');
      setReviewRating(5);
      load();
    } catch (err) {
      setReviewError(getApiErrorMessage(err, 'Unable to submit your review right now.'));
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="pt-16 md:pt-20">
      <section className="bg-offwhite">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* gallery */}
          <div>
            <div
              className="relative aspect-square rounded-sm overflow-hidden bg-white border border-cocoa/10 cursor-zoom-in"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setZoom({ active: true, x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
              }}
              onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
            >
              <img
                src={images[activeImage]}
                alt={`${product.name} bottle, view ${activeImage + 1}`}
                className="h-full w-full object-cover transition-transform duration-300"
                style={
                  zoom.active
                    ? { transform: 'scale(1.9)', transformOrigin: `${zoom.x}% ${zoom.y}%` }
                    : undefined
                }
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {images.map((img, i) => (
                  <button
                    key={img + i}
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-16 rounded-sm overflow-hidden border-2 transition-colors ${
                      activeImage === i ? 'border-champagne' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* info */}
          <div className="text-cocoa">
            <span className="text-[11px] tracking-[0.2em] uppercase text-champagne">{product.collectionName} &middot; {product.gender}</span>
            <h1 className="font-display text-3xl md:text-4xl mt-2">{product.name}</h1>
            <div className="flex items-center gap-2 mt-3">
              <StarRating rating={product.rating} size={15} />
              <span className="text-xs text-cocoa/50">{product.numReviews} reviews</span>
            </div>
            <p className="font-display text-2xl text-champagne mt-5">
              {!selectedSizeOption && product.sizes.length > 1 && (
                <span className="text-xs text-cocoa/45 uppercase tracking-wide mr-1.5 align-middle">From</span>
              )}
              {formatCurrency(displayPrice)}
            </p>
            <p className="text-cocoa/65 leading-relaxed mt-5 max-w-lg">{product.description}</p>

            <div className="mt-7">
              <p className="label-field mb-2.5">Select Size</p>
              <SizeSelector
                sizes={product.sizes}
                selected={selectedSize}
                onSelect={(s) => {
                  setSelectedSize(s);
                  setSizeError(false);
                }}
                layoutId="pdp-size-bg"
              />
              {sizeError && <p className="text-xs text-rose-champagne mt-2.5">Please select a bottle size.</p>}
            </div>

            <div className="flex flex-wrap gap-4 mt-6 text-sm text-cocoa/70">
              <span>Longevity: <strong className="text-cocoa">{product.longevity}</strong></span>
              <span>Sillage: <strong className="text-cocoa">{product.sillage}</strong></span>
              <span>
                Stock:{' '}
                <strong className={product.stock > 0 ? 'text-cocoa' : 'text-rose-champagne'}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </strong>
              </span>
            </div>

            <div className="flex flex-wrap gap-6 mt-5">
              {product.occasion?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.occasion.map((o) => (
                    <span key={o} className="text-[11px] px-2.5 py-1 rounded-full border border-champagne/30 text-cocoa/70">
                      {o}
                    </span>
                  ))}
                </div>
              )}
              {product.season?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.season.map((s) => (
                    <span key={s} className="text-[11px] px-2.5 py-1 rounded-full border border-rose-champagne/30 text-cocoa/70">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <QuantitySelector value={qty} onChange={setQty} max={Math.max(product.stock, 1)} />
              <button
                disabled={product.stock === 0}
                onClick={() => addToCart(false)}
                className="btn-outline-dark flex-1 disabled:opacity-40"
              >
                Add to Cart
              </button>
              <button
                disabled={product.stock === 0}
                onClick={() => addToCart(true)}
                className="btn-primary flex-1 disabled:opacity-40"
              >
                Buy Now
              </button>
              <button
                onClick={() => toggle(product)}
                aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`h-12 w-12 shrink-0 rounded-sm border flex items-center justify-center transition-colors ${
                  wished ? 'border-champagne bg-champagne/10' : 'border-cocoa/20 hover:border-champagne'
                }`}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill={wished ? '#D6B77C' : 'none'} stroke="#D6B77C" strokeWidth="1.4">
                  <path d="M12 20s-7-4.35-9.5-8.5C.7 8 2 4.5 5.5 4.5c2 0 3.5 1 4.5 2.5.7 1 1 1 1 1s.3 0 1-1c1-1.5 2.5-2.5 4.5-2.5 3.5 0 4.8 3.5 3 7C19 15.65 12 20 12 20z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* notes */}
      <section className="bg-offwhite py-14 md:py-20 border-t border-cocoa/5">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="text-center mb-8">
            <span className="eyebrow text-champagne/90">The Composition</span>
            <h2 className="section-heading text-cocoa mt-3">Notes</h2>
          </Reveal>
          <NotesDiagram topNotes={product.topNotes} heartNotes={product.heartNotes} baseNotes={product.baseNotes} />
        </div>
      </section>

      {/* reviews */}
      <section className="bg-offwhite py-14 md:py-20 border-t border-cocoa/5">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="section-heading text-cocoa mb-8">Reviews ({product.numReviews})</h2>

          {product.reviews.length === 0 ? (
            <p className="text-cocoa/60 mb-10">Be the first to share your experience with this fragrance.</p>
          ) : (
            <ul className="space-y-6 mb-12">
              {product.reviews.map((r, i) => (
                <li key={i} className="bg-white p-5 rounded-sm border border-cocoa/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-cocoa">{r.name}</span>
                    <StarRating rating={r.rating} size={12} />
                  </div>
                  <p className="text-sm text-cocoa/70">{r.comment}</p>
                </li>
              ))}
            </ul>
          )}

          <div className="bg-white p-6 rounded-sm border border-cocoa/10">
            <h3 className="font-display text-lg text-cocoa mb-4">Write a Review</h3>
            {isAuthenticated ? (
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="label-field">Your Rating</label>
                  <StarRating rating={reviewRating} interactive onChange={setReviewRating} size={22} />
                </div>
                <div>
                  <label className="label-field">Your Review</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Share your experience with this fragrance..."
                  />
                </div>
                {reviewError && <p className="text-sm text-rose-champagne">{reviewError}</p>}
                <button type="submit" disabled={submittingReview} className="btn-primary">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <p className="text-sm text-cocoa/60">
                Please{' '}
                <Link to="/login" className="text-champagne underline">
                  sign in
                </Link>{' '}
                to leave a review.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* related */}
      {related.length > 0 && (
        <section className="bg-offwhite py-14 md:py-20 border-t border-cocoa/5">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="section-heading text-cocoa mb-8">You May Also Love</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.slice(0, 4).map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
