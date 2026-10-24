import { SAMPLE_PRODUCTS } from '../data/sampleProducts';
import type { Product } from '../types';

const STORAGE_KEY = 'mens_outfit_custom_products';

export function getAllProducts(): Product[] {
  try {
    const custom = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(custom) && custom.length > 0) {
      return [...custom, ...SAMPLE_PRODUCTS];
    }
  } catch (e) {
    console.warn('Failed to load custom products from localStorage', e);
  }
  return SAMPLE_PRODUCTS;
}

export function saveProduct(product: Product): void {
  try {
    const custom = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const existingIndex = custom.findIndex((p: Product) => p.id === product.id);
    if (existingIndex >= 0) {
      custom[existingIndex] = product;
    } else {
      custom.unshift(product);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
  } catch (e) {
    console.warn('Failed to save product to localStorage', e);
  }
}

export function deleteProduct(productId: string): void {
  try {
    const custom = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = custom.filter((p: Product) => p.id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Failed to delete product from localStorage', e);
  }
}
