import type { Product } from '../types';

const REMOTE_PRODUCTS_KEY = 'mens_outfit_remote_products_cache';

function normalizeRemoteProducts(products: any[]): Product[] {
  return products.map((p) => ({
    ...p,
    id: p._id || p.id,
    category: typeof p.category === 'string' ? p.category : (p.category?.name || 'Uncategorized'),
    rating: p.averageRating ?? p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    variants: (p.variants || []).map((v: any, index: number) => ({ ...v, id: v.id || `${p._id || p.id}-${index}` })),
  }));
}

// Keep a display cache for synchronous page consumers; the API remains the source of truth.
export function setRemoteProducts(products: any[]): void {
  try {
    // Admin API includes drafts; only published products belong in the storefront cache.
    localStorage.setItem(REMOTE_PRODUCTS_KEY, JSON.stringify(products.filter((product) => product.isPublished !== false)));
    window.dispatchEvent(new Event('products_updated'));
  } catch (error) {
    console.warn('Could not cache the latest product list', error);
  }
}

export function getAllProducts(): Product[] {
  try {
    const remote = localStorage.getItem(REMOTE_PRODUCTS_KEY);
    if (remote !== null) {
      return normalizeRemoteProducts(JSON.parse(remote));
    }
  } catch (e) {
    console.warn('Failed to load cached database products', e);
  }
  return [];
}
