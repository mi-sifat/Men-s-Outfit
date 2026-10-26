import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { AppError } from '../utils/AppError';
import slugify from 'slugify';

// GET /api/categories (Public list or all for admin)
export const getCategories = async (req: Request, res: Response) => {
  const { all, showOnHome, showInNav } = req.query;

  const query: any = {};
  if (all !== 'true') {
    query.isActive = true;
  }
  if (showOnHome === 'true') {
    query.showOnHome = true;
  }
  if (showInNav === 'true') {
    query.showInNav = true;
  }

  const categories = await Category.find(query)
    .populate('parentCategory', 'name nameBn slug')
    .sort({ order: 1, createdAt: 1 })
    .lean();

  res.status(200).json({
    success: true,
    data: categories,
  });
};

// GET /api/categories/:slug
export const getCategoryBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug: slug.toLowerCase() })
    .populate('parentCategory', 'name nameBn slug')
    .lean();

  if (!category) {
    throw AppError.notFound('ক্যাটাগরি পাওয়া যায়নি।');
  }

  res.status(200).json({
    success: true,
    data: category,
  });
};

// POST /api/categories (Admin only)
export const createCategory = async (req: Request, res: Response) => {
  const { name, nameBn, slug, description, image, icon, order, isActive, showOnHome, showInNav, parentCategory } = req.body;

  if (!name) {
    throw AppError.badRequest('ক্যাটাগরির নাম আবশ্যক।');
  }

  const finalSlug = slug
    ? slugify(slug, { lower: true, strict: true })
    : slugify(name, { lower: true, strict: true });

  const existing = await Category.findOne({ slug: finalSlug });
  if (existing) {
    throw AppError.conflict('এই স্ল্যাগের ক্যাটাগরি ইতিমধ্যে বিদ্যমান।');
  }

  const category = await Category.create({
    name,
    nameBn,
    slug: finalSlug,
    description,
    image,
    icon,
    order: order !== undefined ? Number(order) : 0,
    isActive: isActive !== undefined ? isActive : true,
    showOnHome: showOnHome !== undefined ? showOnHome : true,
    showInNav: showInNav !== undefined ? showInNav : true,
    parentCategory: parentCategory || undefined,
  });

  res.status(201).json({
    success: true,
    message: 'ক্যাটাগরি সফলভাবে তৈরি করা হয়েছে।',
    data: category,
  });
};

// PUT /api/categories/:id (Admin only)
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, nameBn, slug, description, image, icon, order, isActive, showOnHome, showInNav, parentCategory } = req.body;

  const category = await Category.findById(id);
  if (!category) {
    throw AppError.notFound('ক্যাটাগরি পাওয়া যায়নি।');
  }

  if (slug && slug !== category.slug) {
    const finalSlug = slugify(slug, { lower: true, strict: true });
    const existing = await Category.findOne({ slug: finalSlug, _id: { $ne: id } });
    if (existing) {
      throw AppError.conflict('এই স্ল্যাগের অন্য একটি ক্যাটাগরি ইতিমধ্যে রয়েছে।');
    }
    category.slug = finalSlug;
  }

  if (name !== undefined) category.name = name;
  if (nameBn !== undefined) category.nameBn = nameBn;
  if (description !== undefined) category.description = description;
  if (image !== undefined) category.image = image;
  if (icon !== undefined) category.icon = icon;
  if (order !== undefined) category.order = Number(order);
  if (isActive !== undefined) category.isActive = isActive;
  if (showOnHome !== undefined) category.showOnHome = showOnHome;
  if (showInNav !== undefined) category.showInNav = showInNav;
  if (parentCategory !== undefined) category.parentCategory = parentCategory || undefined;

  await category.save();

  res.status(200).json({
    success: true,
    message: 'ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে।',
    data: category,
  });
};

// DELETE /api/categories/:id (Admin only)
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    throw AppError.notFound('ক্যাটাগরি পাওয়া যায়নি।');
  }

  // Safety check: ensure no products are attached to this category
  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    throw AppError.badRequest(
      `এই ক্যাটাগরিতে ${productCount} টি প্রোডাক্ট রয়েছে। আগে প্রোডাক্টগুলো অন্য ক্যাটাগরিতে সরিয়ে নিন।`
    );
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'ক্যাটাগরি সফলভাবে মুছে ফেলা হয়েছে।',
  });
};
