import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon, 
  X, 
  Save, 
  Eye, 
  EyeOff, 
  ExternalLink,
  Smartphone,
  Monitor
} from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';
import { 
  getLocalStoreSettings, 
  saveLocalStoreSettings 
} from '../../data/settingsStore';
import type { BannerItem } from '../../data/settingsStore';

export const BannerManager: React.FC = () => {
  const [settings, setSettings] = useState(() => getLocalStoreSettings());
  const [banners, setBanners] = useState<BannerItem[]>(() => {
    return (settings.banners || []).sort((a, b) => a.order - b.order);
  });

  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [buttonText, setButtonText] = useState('SHOP NOW');
  const [linkUrl, setLinkUrl] = useState('/shop');
  const [imageUrl, setImageUrl] = useState('');
  const [mobileImageUrl, setMobileImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [badgeText, setBadgeText] = useState('SUMMER DROP 2026');
  const [badgeTextBn, setBadgeTextBn] = useState('এক্সক্লুসিভ স্ট্রিটওয়্যার ২০২৬');
  const [isActive, setIsActive] = useState(true);

  const refreshBanners = () => {
    const s = getLocalStoreSettings();
    setSettings(s);
    setBanners((s.banners || []).sort((a, b) => a.order - b.order));
  };

  useEffect(() => {
    window.addEventListener('store_settings_updated', refreshBanners);
    return () => window.removeEventListener('store_settings_updated', refreshBanners);
  }, []);

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setButtonText('SHOP NOW');
    setLinkUrl('/shop');
    setImageUrl('');
    setMobileImageUrl('');
    setAltText('');
    setBadgeText('SUMMER DROP 2026');
    setBadgeTextBn('এক্সক্লুসিভ স্ট্রিটওয়্যার ২০২৬');
    setIsActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (b: BannerItem) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle || '');
    setButtonText(b.buttonText || 'SHOP NOW');
    setLinkUrl(b.linkUrl || '/shop');
    setImageUrl(b.imageUrl);
    setMobileImageUrl(b.mobileImageUrl || '');
    setAltText(b.altText || '');
    setBadgeText(b.badgeText || '');
    setBadgeTextBn(b.badgeTextBn || '');
    setIsActive(b.isActive);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      toast.error('Banner title and desktop image URL are required');
      return;
    }

    const bannerData: BannerItem = {
      id: editingBanner ? editingBanner.id : `banner-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      buttonText: buttonText.trim() || 'SHOP NOW',
      linkUrl: linkUrl.trim() || '/shop',
      imageUrl: imageUrl.trim(),
      mobileImageUrl: mobileImageUrl.trim() || undefined,
      altText: altText.trim() || title.trim(),
      badgeText: badgeText.trim() || undefined,
      badgeTextBn: badgeTextBn.trim() || undefined,
      isActive,
      order: editingBanner ? editingBanner.order : banners.length + 1,
    };

    const currentBanners = [...banners];
    if (editingBanner) {
      const idx = currentBanners.findIndex((b) => b.id === editingBanner.id);
      if (idx >= 0) currentBanners[idx] = bannerData;
    } else {
      currentBanners.push(bannerData);
    }

    const updatedSettings = { ...settings, banners: currentBanners };
    saveLocalStoreSettings(updatedSettings);
    toast.success(editingBanner ? 'Banner updated successfully!' : 'Banner created successfully!');
    setShowModal(false);
    refreshBanners();
  };

  const handleDelete = (id: string, bannerTitle: string) => {
    if (confirm(`Delete banner "${bannerTitle}"?`)) {
      const filtered = banners.filter((b) => b.id !== id);
      const updatedSettings = { ...settings, banners: filtered };
      saveLocalStoreSettings(updatedSettings);
      toast.success('Banner deleted.');
      refreshBanners();
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = banners.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b));
    saveLocalStoreSettings({ ...settings, banners: updated });
    toast.success('Banner status toggled');
    refreshBanners();
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= banners.length) return;

    const copy = [...banners];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIdx, 0, moved);

    const reordered = copy.map((b, idx) => ({ ...b, order: idx + 1 }));
    saveLocalStoreSettings({ ...settings, banners: reordered });
    toast.success('Banners reordered');
    refreshBanners();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#C5A880]" />
            <span>Homepage Hero Banners ({banners.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Manage multi-slide hero carousel banners, desktop and mobile responsive images, and CTA destinations
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAdd}
          className="gap-2 bg-slate-900 text-white hover:bg-black cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </Button>
      </div>

      {/* Banner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {banners.map((b, index) => (
          <div
            key={b.id}
            className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between transition-all hover:shadow-md"
          >
            <div>
              {/* Image Preview Container */}
              <div className="relative aspect-16/9 w-full bg-slate-900 overflow-hidden group">
                <img
                  src={b.imageUrl}
                  alt={b.altText || b.title}
                  className="w-full h-full object-cover brightness-90 group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                  <button
                    onClick={() => handleToggleActive(b.id)}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-md cursor-pointer ${
                      b.isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {b.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>
                {b.badgeText && (
                  <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                    {b.badgeText}
                  </span>
                )}
              </div>

              {/* Banner Details */}
              <div className="p-4 space-y-1.5">
                <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{b.title}</h4>
                {b.subtitle && (
                  <p className="text-xs text-slate-500 line-clamp-2">{b.subtitle}</p>
                )}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span className="text-blue-600 font-semibold truncate max-w-[150px]">
                    "{b.buttonText}" &rarr; {b.linkUrl}
                  </span>
                  {b.mobileImageUrl ? (
                    <span className="flex items-center gap-1 text-emerald-600" title="Custom mobile image active">
                      <Smartphone className="w-3.5 h-3.5" /> Mobile
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-400" title="Uses desktop image on mobile">
                      <Monitor className="w-3.5 h-3.5" /> Auto
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono font-bold text-slate-600 mr-1">#{b.order || index + 1}</span>
                <button
                  disabled={index === 0}
                  onClick={() => handleMove(index, 'up')}
                  className="p-1 rounded text-slate-400 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={index === banners.length - 1}
                  onClick={() => handleMove(index, 'down')}
                  className="p-1 rounded text-slate-400 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded cursor-pointer"
                  title="Edit Banner"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(b.id, b.title)}
                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded cursor-pointer"
                  title="Delete Banner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Banner Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingBanner ? 'Edit Hero Banner' : 'Create New Hero Banner'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Banner Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CASUAL & STREETWEAR ESSENTIALS"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. 100% Combed Heavy Cotton. Built for comfort, durability, and bold aesthetics."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Desktop Image URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Mobile Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={mobileImageUrl}
                    onChange={(e) => setMobileImageUrl(e.target.value)}
                    placeholder="Optimized 4:5 or 1:1 image for mobile"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Preview image */}
              {imageUrl && (
                <div className="h-28 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                  <img src={imageUrl} alt="Desktop Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="SHOP NOW"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Destination URL
                  </label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="/shop or /category/oversized"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Badge Text (English)
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="SUMMER & STREET DROP 2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Badge Text (Bangla)
                  </label>
                  <input
                    type="text"
                    value={badgeTextBn}
                    onChange={(e) => setBadgeTextBn(e.target.value)}
                    placeholder="এক্সক্লুসিভ স্ট্রিটওয়্যার ২০২৬"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Image Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="e.g. Men's Outfit Streetwear Drop Shoulder Summer Collection"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <input
                  type="checkbox"
                  id="banner-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-slate-900 cursor-pointer"
                />
                <label htmlFor="banner-active" className="text-slate-700 font-semibold cursor-pointer">
                  Display this banner in the hero slider
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
                  <span>{editingBanner ? 'Save Changes' : 'Create Banner'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
