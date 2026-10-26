export interface CategoryItem {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  showOnHome: boolean;
  showInNav: boolean;
  parentCategory?: string;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Oversized T-Shirts',
    nameBn: 'ওভারসাইজড টি-শার্ট',
    slug: 'oversized',
    description: '২৬০ GSM প্রিমিয়াম হেভিওয়েট সুতি ও রিল্যাক্সড কমফোর্ট স্ট্রিটওয়্যার',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    icon: 'Shirt',
    order: 1,
    isActive: true,
    showOnHome: true,
    showInNav: true,
  },
  {
    id: 'cat-2',
    name: 'Drop Shoulder T-Shirts',
    nameBn: 'ড্রপ শোল্ডার টি-শার্ট',
    slug: 'drop-shoulder',
    description: '২২০-২৪০ GSM মডার্ন স্ট্রিটওয়্যার সিলুয়েট ও আলটিমেট ফিনিশ',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
    icon: 'Layers',
    order: 2,
    isActive: true,
    showOnHome: true,
    showInNav: true,
  },
  {
    id: 'cat-3',
    name: 'Graphic Tees',
    nameBn: 'গ্রাফিক টিজ',
    slug: 'graphic-tees',
    description: 'হাই-ডেনসিটি স্ক্রিন প্রিন্ট ও ইউনিক আর্বান স্ট্রিট আর্ট',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    icon: 'Sparkles',
    order: 3,
    isActive: true,
    showOnHome: true,
    showInNav: true,
  },
  {
    id: 'cat-4',
    name: 'Polo Shirts',
    nameBn: 'প্রিমিয়াম পোলো শার্ট',
    slug: 'polo',
    description: '২৬০ GSM লাক্সারি হানি-কম্ব পিক কটন ও এলিগ্যান্ট আর্কিটেকচারাল কলার',
    image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&auto=format&fit=crop&q=80',
    icon: 'Award',
    order: 4,
    isActive: true,
    showOnHome: true,
    showInNav: true,
  },
];

const STORAGE_KEY = 'mens_outfit_categories';

export function getAllCategories(): CategoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    }
  } catch (e) {
    console.warn('Failed to parse categories from storage:', e);
  }
  return DEFAULT_CATEGORIES;
}

export function getActiveCategories(): CategoryItem[] {
  return getAllCategories().filter((c) => c.isActive);
}

export function getHomeCategories(): CategoryItem[] {
  return getAllCategories().filter((c) => c.isActive && c.showOnHome);
}

export function getNavCategories(): CategoryItem[] {
  return getAllCategories().filter((c) => c.isActive && c.showInNav);
}

export function saveCategory(category: CategoryItem): void {
  try {
    const categories = getAllCategories();
    const existingIndex = categories.findIndex((c) => c.id === category.id || c.slug === category.slug);

    if (existingIndex >= 0) {
      categories[existingIndex] = { ...categories[existingIndex], ...category };
    } else {
      categories.push({
        ...category,
        id: category.id || `cat-${Date.now()}`,
        order: category.order || categories.length + 1,
      });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event('categories_updated'));
  } catch (e) {
    console.error('Failed to save category:', e);
  }
}

export function deleteCategory(id: string): { success: boolean; message?: string } {
  try {
    const categories = getAllCategories();
    const filtered = categories.filter((c) => c.id !== id);
    if (filtered.length === categories.length) {
      return { success: false, message: 'Category not found' };
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('categories_updated'));
    return { success: true };
  } catch (e) {
    return { success: false, message: (e as any).message };
  }
}

export function reorderCategories(orderedIds: string[]): void {
  try {
    const categories = getAllCategories();
    const reordered = categories.map((cat) => {
      const idx = orderedIds.indexOf(cat.id);
      return {
        ...cat,
        order: idx >= 0 ? idx + 1 : cat.order,
      };
    });
    reordered.sort((a, b) => a.order - b.order);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reordered));
    window.dispatchEvent(new Event('categories_updated'));
  } catch (e) {
    console.error('Failed to reorder categories:', e);
  }
}
