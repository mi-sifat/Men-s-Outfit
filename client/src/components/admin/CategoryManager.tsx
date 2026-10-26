import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Layers, 
  X, 
  Save, 
  Search,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';
import { 
  getAllCategories, 
  saveCategory, 
  deleteCategory, 
  reorderCategories 
} from '../../data/categoryStore';
import type { CategoryItem } from '../../data/categoryStore';
import { getAllProducts } from '../../data/productStore';
import type { Product } from '../../types';

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>(() => getAllCategories());
  const [products] = useState<Product[]>(() => getAllProducts());
  const [search, setSearch] = useState('');

  // Add / Edit Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [showOnHome, setShowOnHome] = useState(true);
  const [showInNav, setShowInNav] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const refreshCategories = () => {
    setCategories(getAllCategories());
  };

  useEffect(() => {
    window.addEventListener('categories_updated', refreshCategories);
    return () => window.removeEventListener('categories_updated', refreshCategories);
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setNameBn('');
    setSlug('');
    setDescription('');
    setImage('');
    setShowOnHome(true);
    setShowInNav(true);
    setIsActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setNameBn(cat.nameBn || '');
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setShowOnHome(cat.showOnHome !== false);
    setShowInNav(cat.showInNav !== false);
    setIsActive(cat.isActive);
    setShowModal(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(val.toLowerCase().trim().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    const finalSlug = slug.trim() || name.toLowerCase().trim().replace(/[\s_]+/g, '-');

    const catData: CategoryItem = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name: name.trim(),
      nameBn: nameBn.trim() || undefined,
      slug: finalSlug,
      description: description.trim() || undefined,
      image: image.trim() || undefined,
      showOnHome,
      showInNav,
      isActive,
      order: editingCategory ? editingCategory.order : categories.length + 1,
    };

    saveCategory(catData);
    toast.success(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
    setShowModal(false);
    refreshCategories();
  };

  const handleDelete = (cat: CategoryItem) => {
    // Check if any products exist in this category
    const catSlug = cat.slug.toLowerCase();
    const count = products.filter(
      (p) => p.category.toLowerCase().replace(/[\s_]+/g, '-') === catSlug
    ).length;

    if (count > 0) {
      toast.error(`Cannot delete: ${count} products are currently assigned to "${cat.name}". Reassign them first.`);
      return;
    }

    if (confirm(`Are you sure you want to delete "${cat.name}"?`)) {
      const res = deleteCategory(cat.id);
      if (res.success) {
        toast.success(`Category "${cat.name}" deleted.`);
        refreshCategories();
      } else {
        toast.error(res.message || 'Failed to delete category');
      }
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= categories.length) return;

    const copy = [...categories];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIdx, 0, moved);

    reorderCategories(copy.map((c) => c.id));
    refreshCategories();
    toast.success('Categories reordered');
  };

  const handleToggleActive = (cat: CategoryItem) => {
    saveCategory({ ...cat, isActive: !cat.isActive });
    toast.success(`Category ${!cat.isActive ? 'activated' : 'deactivated'}`);
    refreshCategories();
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.nameBn && c.nameBn.includes(search)) ||
    c.slug.includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#C5A880]" />
            <span>Category Manager ({categories.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Create, edit, reorder, and configure category visibility for the homepage and navigation menu
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAdd}
          className="gap-2 bg-slate-900 text-white hover:bg-black cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </Button>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories by name or slug..."
          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
        />
      </div>

      {/* Category Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Order</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Attached Products</th>
                <th className="py-3 px-4 text-center">Home Strip</th>
                <th className="py-3 px-4 text-center">Nav Menu</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map((cat, index) => {
                const catSlug = cat.slug.toLowerCase();
                const productCount = products.filter(
                  (p) => p.category.toLowerCase().replace(/[\s_]+/g, '-') === catSlug
                ).length;

                return (
                  <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Order & Reorder Controls */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 font-mono text-slate-400">
                        <span className="font-bold text-slate-700">{cat.order || index + 1}</span>
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
                            disabled={index === categories.length - 1}
                            onClick={() => handleMove(index, 'down')}
                            className="text-slate-400 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Category Title & Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-10 h-10 object-cover rounded-md border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                            <Layers className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">{cat.name}</p>
                          {cat.nameBn && (
                            <p className="text-[11px] text-slate-500 font-normal">{cat.nameBn}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
                        /{cat.slug}
                      </span>
                    </td>

                    {/* Products Count */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 font-mono">
                        {productCount} items
                      </span>
                    </td>

                    {/* Home Strip Toggle */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          cat.showOnHome
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {cat.showOnHome ? 'Visible' : 'Hidden'}
                      </span>
                    </td>

                    {/* Nav Menu Toggle */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          cat.showInNav
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {cat.showInNav ? 'Visible' : 'Hidden'}
                      </span>
                    </td>

                    {/* Active Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                          cat.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cat.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {cat.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
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
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Oversized T-Shirts"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Category Name (Bangla)
                </label>
                <input
                  type="text"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="যেমন: ওভারসাইজড টি-শার্ট"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. oversized"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Accessible at: /category/{slug || 'example'}
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Image or Banner URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
                {image && (
                  <div className="mt-2 h-20 w-32 rounded-lg overflow-hidden border border-slate-200">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Description / Subtitle
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description for category cards and SEO"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnHome}
                    onChange={(e) => setShowOnHome(e.target.checked)}
                    className="rounded text-slate-900"
                  />
                  <span className="text-slate-700 font-medium">Show on Home</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInNav}
                    onChange={(e) => setShowInNav(e.target.checked)}
                    className="rounded text-slate-900"
                  />
                  <span className="text-slate-700 font-medium">Show in Nav</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-slate-900"
                  />
                  <span className="text-slate-700 font-medium">Active</span>
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
                  <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
