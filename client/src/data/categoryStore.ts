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

const REMOTE_CATEGORIES_KEY = 'mens_outfit_remote_categories_cache';

export function setRemoteCategories(categories: any[]): void {
  try {
    localStorage.setItem(REMOTE_CATEGORIES_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event('categories_updated'));
  } catch (e) { console.warn('Could not cache the latest categories', e); }
}

export function getAllCategories(): CategoryItem[] {
  try {
    const remote = localStorage.getItem(REMOTE_CATEGORIES_KEY);
    if (remote !== null) return JSON.parse(remote).map((category: any) => ({ ...category, id: category._id || category.id }));
  } catch (e) {
    console.warn('Failed to parse categories from storage:', e);
  }
  return [];
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
