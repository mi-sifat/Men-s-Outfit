import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Sliders, 
  X, 
  Save, 
  Eye, 
  EyeOff, 
  LayoutGrid, 
  Layers, 
  Sparkles, 
  ShoppingBag, 
  ShieldCheck, 
  Image as ImageIcon 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';
import { 
  getLocalStoreSettings, 
  saveLocalStoreSettings, 
  saveHomepageSections, 
  reorderHomepageSections, 
  toggleHomepageSection 
} from '../../data/settingsStore';
import type { HomepageSectionItem, HomepageSectionType } from '../../data/settingsStore';
import { getAllCategories } from '../../data/categoryStore';
import { getAllProducts } from '../../data/productStore';

export const HomepageSectionManager: React.FC = () => {
  const [sections, setSections] = useState<HomepageSectionItem[]>(() => {
    const s = getLocalStoreSettings();
    return (s.homepageSections || []).sort((a, b) => a.order - b.order);
  });

  const categories = getAllCategories();
  const products = getAllProducts();

  // Add / Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState<HomepageSectionItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [subtitleBn, setSubtitleBn] = useState('');
  const [type, setType] = useState<HomepageSectionType>('category');
  const [categorySlug, setCategorySlug] = useState('drop-shoulder');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'popular'>('newest');
  const [viewAllText, setViewAllText] = useState('View All');
  const [viewAllTextBn, setViewAllTextBn] = useState('সবগুলো দেখুন');
  const [viewAllLink, setViewAllLink] = useState('');
  const [layout, setLayout] = useState<'grid-5' | 'grid-4' | 'slider'>('grid-5');
  const [isActive, setIsActive] = useState(true);

  // Promo Banner Fields (for banner_promo type)
  const [promoTitle, setPromoTitle] = useState('');
  const [promoTitleBn, setPromoTitleBn] = useState('');
  const [promoSubtitle, setPromoSubtitle] = useState('');
  const [promoSubtitleBn, setPromoSubtitleBn] = useState('');
  const [promoImageUrl, setPromoImageUrl] = useState('');
  const [promoLinkUrl, setPromoLinkUrl] = useState('/shop');
  const [promoButtonText, setPromoButtonText] = useState('EXPLORE COLLECTION');
  const [promoButtonTextBn, setPromoButtonTextBn] = useState('কালেকশন দেখুন');

  const refreshSections = () => {
    const s = getLocalStoreSettings();
    setSections((s.homepageSections || []).sort((a, b) => a.order - b.order));
  };

  useEffect(() => {
    window.addEventListener('store_settings_updated', refreshSections);
    return () => window.removeEventListener('store_settings_updated', refreshSections);
  }, []);

  const handleOpenAdd = () => {
    setEditingSection(null);
    setTitle('');
    setTitleBn('');
    setSubtitle('');
    setSubtitleBn('');
    setType('category');
    setCategorySlug(categories[0]?.slug || 'drop-shoulder');
    setSelectedProductIds([]);
    setLimit(5);
    setSortBy('newest');
    setViewAllText('View All');
    setViewAllTextBn('সবগুলো দেখুন');
    setViewAllLink('');
    setLayout('grid-5');
    setIsActive(true);
    setPromoTitle('');
    setPromoImageUrl('');
    setShowModal(true);
  };

  const handleOpenEdit = (sec: HomepageSectionItem) => {
    setEditingSection(sec);
    setTitle(sec.title);
    setTitleBn(sec.titleBn || '');
    setSubtitle(sec.subtitle || '');
    setSubtitleBn(sec.subtitleBn || '');
    setType(sec.type);
    setCategorySlug(sec.categorySlug || categories[0]?.slug || 'drop-shoulder');
    setSelectedProductIds(sec.productIds || []);
    setLimit(sec.limit || 5);
    setSortBy(sec.sortBy || 'newest');
    setViewAllText(sec.viewAllText || 'View All');
    setViewAllTextBn(sec.viewAllTextBn || 'সবগুলো দেখুন');
    setViewAllLink(sec.viewAllLink || '');
    setLayout(sec.layout || 'grid-5');
    setIsActive(sec.isActive);

    if (sec.promoBanner) {
      setPromoTitle(sec.promoBanner.title || '');
      setPromoTitleBn(sec.promoBanner.titleBn || '');
      setPromoSubtitle(sec.promoBanner.subtitle || '');
      setPromoSubtitleBn(sec.promoBanner.subtitleBn || '');
      setPromoImageUrl(sec.promoBanner.imageUrl || '');
      setPromoLinkUrl(sec.promoBanner.linkUrl || '/shop');
      setPromoButtonText(sec.promoBanner.buttonText || 'EXPLORE COLLECTION');
      setPromoButtonTextBn(sec.promoBanner.buttonTextBn || 'কালেকশন দেখুন');
    } else {
      setPromoTitle('');
      setPromoImageUrl('');
    }

    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Section title is required');
      return;
    }

    const sectionData: HomepageSectionItem = {
      id: editingSection ? editingSection.id : `sec-${Date.now()}`,
      title: title.trim(),
      titleBn: titleBn.trim() || undefined,
      subtitle: subtitle.trim() || undefined,
      subtitleBn: subtitleBn.trim() || undefined,
      type,
      categorySlug: type === 'category' ? categorySlug : undefined,
      productIds: type === 'manual' ? selectedProductIds : undefined,
      limit: Number(limit) || 5,
      sortBy,
      viewAllText: viewAllText.trim() || 'View All',
      viewAllTextBn: viewAllTextBn.trim() || 'সবগুলো দেখুন',
      viewAllLink: viewAllLink.trim() || undefined,
      layout,
      isActive,
      order: editingSection ? editingSection.order : sections.length + 1,
      promoBanner:
        type === 'banner_promo'
          ? {
              title: promoTitle || title,
              titleBn: promoTitleBn || titleBn,
              subtitle: promoSubtitle || subtitle,
              subtitleBn: promoSubtitleBn || subtitleBn,
              imageUrl: promoImageUrl,
              linkUrl: promoLinkUrl,
              buttonText: promoButtonText,
              buttonTextBn: promoButtonTextBn,
            }
          : undefined,
    };

    const currentSections = [...sections];
    if (editingSection) {
      const idx = currentSections.findIndex((s) => s.id === editingSection.id);
      if (idx >= 0) currentSections[idx] = sectionData;
    } else {
      currentSections.push(sectionData);
    }

    saveHomepageSections(currentSections);
    toast.success(editingSection ? 'Homepage section updated!' : 'New section added to homepage!');
    setShowModal(false);
    refreshSections();
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Remove section "${title}" from the homepage?`)) {
      const filtered = sections.filter((s) => s.id !== id);
      saveHomepageSections(filtered);
      toast.success('Section removed.');
      refreshSections();
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= sections.length) return;

    const copy = [...sections];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIdx, 0, moved);

    reorderHomepageSections(copy.map((s) => s.id));
    refreshSections();
    toast.success('Section order updated');
  };

  const handleToggle = (id: string) => {
    toggleHomepageSection(id);
    refreshSections();
    toast.success('Section visibility toggled');
  };

  const getTypeLabel = (t: HomepageSectionType) => {
    switch (t) {
      case 'hero_slider': return 'Hero Slider';
      case 'category_icons': return 'Category Strip';
      case 'policy_strip': return 'Trust & Policies';
      case 'new_arrivals': return 'New Arrivals Grid';
      case 'category': return 'Category Showcase';
      case 'featured': return 'Featured Products';
      case 'manual': return 'Custom Selected Products';
      case 'sale': return 'Sale & Offers';
      case 'banner_promo': return 'Promo Graphic Banner';
      case 'social_brand': return 'Brand & Social';
      default: return t;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#C5A880]" />
            <span>Homepage Section Manager ({sections.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Reorder, enable/disable, add custom category showcases or promotional banners directly without editing frontend code
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAdd}
          className="gap-2 bg-slate-900 text-white hover:bg-black cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Homepage Section</span>
        </Button>
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 w-14 text-center">Order</th>
                <th className="py-3 px-4">Section Heading</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Configuration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sections.map((sec, index) => (
                <tr key={sec.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Order & Move Buttons */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 font-mono text-slate-400">
                      <span className="font-bold text-slate-800">{sec.order || index + 1}</span>
                      <div className="flex flex-col ml-1">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMove(index, 'up')}
                          className="text-slate-400 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={index === sections.length - 1}
                          onClick={() => handleMove(index, 'down')}
                          className="text-slate-400 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Heading & Subtitle */}
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-semibold text-slate-900">{sec.title}</p>
                      {sec.subtitle && (
                        <p className="text-[11px] text-slate-500 line-clamp-1">{sec.subtitle}</p>
                      )}
                    </div>
                  </td>

                  {/* Type Badge */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {getTypeLabel(sec.type)}
                    </span>
                  </td>

                  {/* Config Details */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    {sec.type === 'category' && (
                      <span>Category: <strong className="text-blue-600">/{sec.categorySlug}</strong> ({sec.limit || 5} items)</span>
                    )}
                    {sec.type === 'manual' && (
                      <span>Manual ({sec.productIds?.length || 0} selected)</span>
                    )}
                    {sec.type === 'banner_promo' && (
                      <span className="text-amber-600">Promo Banner</span>
                    )}
                    {['new_arrivals', 'featured', 'sale'].includes(sec.type) && (
                      <span>{sec.limit || 5} items ({sec.sortBy || 'newest'})</span>
                    )}
                    {['hero_slider', 'category_icons', 'policy_strip', 'social_brand'].includes(sec.type) && (
                      <span className="text-slate-400">Default layout</span>
                    )}
                  </td>

                  {/* Active Toggle */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggle(sec.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                        sec.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          sec.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      {sec.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(sec)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded cursor-pointer"
                        title="Edit Section"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sec.id, sec.title)}
                        className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded cursor-pointer"
                        title="Delete Section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Section Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingSection ? 'Edit Homepage Section' : 'Add New Homepage Section'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Section Type *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-medium"
                  >
                    <option value="category">Category Products</option>
                    <option value="new_arrivals">New Arrivals</option>
                    <option value="featured">Featured Products</option>
                    <option value="sale">Hot Sale / Discounted</option>
                    <option value="manual">Manually Selected Products</option>
                    <option value="banner_promo">Promotional Graphic Banner</option>
                    <option value="hero_slider">Hero Banner Slider</option>
                    <option value="category_icons">Category Strip</option>
                    <option value="policy_strip">Trust & Policy Strip</option>
                  </select>
                </div>

                {type === 'category' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Target Category *
                    </label>
                    <select
                      value={categorySlug}
                      onChange={(e) => setCategorySlug(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name} (/{c.slug})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Section Heading (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Drop Shoulder Collection"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Section Heading (Bangla)
                  </label>
                  <input
                    type="text"
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    placeholder="যেমন: ড্রপ শোল্ডার টি-শার্ট"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Subtitle (English)
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Short descriptive caption"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Subtitle (Bangla)
                  </label>
                  <input
                    type="text"
                    value={subtitleBn}
                    onChange={(e) => setSubtitleBn(e.target.value)}
                    placeholder="যেমন: প্রিমিয়াম ২৪০ GSM হেভি কটন"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Product Grid Options (When type is product-related) */}
              {['category', 'new_arrivals', 'featured', 'sale', 'manual'].includes(type) && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    Product Display Settings
                  </span>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Item Count
                      </label>
                      <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs"
                      >
                        <option value="4">4 items</option>
                        <option value="5">5 items (1 full row)</option>
                        <option value="8">8 items</option>
                        <option value="10">10 items (2 rows)</option>
                        <option value="15">15 items (3 rows)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Sort Order
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs"
                      >
                        <option value="newest">Newest First</option>
                        <option value="popular">Most Popular</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Layout
                      </label>
                      <select
                        value={layout}
                        onChange={(e) => setLayout(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs"
                      >
                        <option value="grid-5">5 Columns (Desktop)</option>
                        <option value="grid-4">4 Columns</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        View All Label
                      </label>
                      <input
                        type="text"
                        value={viewAllText}
                        onChange={(e) => setViewAllText(e.target.value)}
                        placeholder="View All"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Custom Link (Optional)
                      </label>
                      <input
                        type="text"
                        value={viewAllLink}
                        onChange={(e) => setViewAllLink(e.target.value)}
                        placeholder="/category/drop-shoulder or /shop"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Promo Banner Settings */}
              {type === 'banner_promo' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    Promotional Banner Configuration
                  </span>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Banner Image URL *
                    </label>
                    <input
                      type="text"
                      required
                      value={promoImageUrl}
                      onChange={(e) => setPromoImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={promoButtonText}
                        onChange={(e) => setPromoButtonText(e.target.value)}
                        placeholder="EXPLORE COLLECTION"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Destination Link
                      </label>
                      <input
                        type="text"
                        value={promoLinkUrl}
                        onChange={(e) => setPromoLinkUrl(e.target.value)}
                        placeholder="/shop"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <input
                  type="checkbox"
                  id="sec-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-slate-900 cursor-pointer"
                />
                <label htmlFor="sec-active" className="text-slate-700 font-semibold cursor-pointer">
                  Enable this section on the storefront
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-slate-900 text-white hover:bg-black cursor-pointer font-semibold"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  <span>{editingSection ? 'Save Changes' : 'Add Section'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
