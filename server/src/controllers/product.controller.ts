import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { AppError } from '../utils/AppError';
import slugify from 'slugify';

// GET /api/products (Public listing with search, category, filters, sorting & pagination)
export const getProducts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const skip = (page - 1) * limit;

  const { search, category, size, color, minPrice, maxPrice, sort, isFeatured, isNewArrival, isBestSeller } = req.query;

  const query: any = { isPublished: true };

  // Text search
  if (search) {
    query.$text = { $search: search as string };
  }

  // Category filter by slug or ID
  if (category) {
    const categoryDoc = await Category.findOne({ slug: category });
    if (categoryDoc) {
      query.category = categoryDoc._id;
    }
  }

  // Variant size filter
  if (size) {
    query['variants.size'] = size;
  }

  // Variant color filter
  if (color) {
    query['variants.color'] = color;
  }

  // Price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Badges
  if (isFeatured === 'true') query.isFeatured = true;
  if (isNewArrival === 'true') query.isNewArrival = true;
  if (isBestSeller === 'true') query.isBestSeller = true;

  // Sorting
  let sortOption: any = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'popular') sortOption = { averageRating: -1, reviewCount: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name nameBn slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: products,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
};

// GET /api/products/:slug (Single product details)
export const getProductBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug, isPublished: true })
    .populate('category', 'name nameBn slug')
    .lean();

  if (!product) {
    throw AppError.notFound('পণ্যটি পাওয়া যায়নি।');
  }

  // Get related products from same category
  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isPublished: true,
  })
    .limit(4)
    .lean();

  res.status(200).json({
    success: true,
    data: {
      product,
      relatedProducts,
    },
  });
};

// POST /api/admin/products (Admin create product)
export const createProduct = async (req: Request, res: Response) => {
  const { title, description, category, price, compareAtPrice, costPrice, images, variants, tags, isFeatured, isNewArrival, isBestSeller, sizeGuide, seoTitle, seoDescription } = req.body;

  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (await Product.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const product = await Product.create({
    title,
    slug,
    description,
    category,
    price,
    compareAtPrice,
    costPrice,
    images,
    variants,
    tags,
    isFeatured: !!isFeatured,
    isNewArrival: !!isNewArrival,
    isBestSeller: !!isBestSeller,
    sizeGuide,
    seoTitle,
    seoDescription,
  });

  res.status(201).json({
    success: true,
    message: 'প্রোডাক্ট সফলভাবে যোগ করা হয়েছে।',
    data: product,
  });
};

// PUT /api/admin/products/:id (Admin update product)
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw AppError.notFound('প্রোডাক্ট পাওয়া যায়নি।');
  }

  res.status(200).json({
    success: true,
    message: 'প্রোডাক্ট সফলভাবে আপডেট হয়েছে।',
    data: product,
  });
};

// DELETE /api/admin/products/:id (Admin soft-delete or remove)
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw AppError.notFound('প্রোডাক্ট পাওয়া যায়নি।');
  }

  res.status(200).json({
    success: true,
    message: 'প্রোডাক্ট মুছে ফেলা হয়েছে।',
  });
};
