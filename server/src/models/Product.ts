import mongoose, { Document, Schema } from 'mongoose';

export interface IVariant {
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: string;
  colorCode: string;
  sku: string;
  stock: number;
  price?: number;
}

export interface IProduct extends Document {
  title: string;
  titleBn?: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
  collections?: string[];
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  images: string[];
  variants: IVariant[];
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  sizeGuide?: string;
  seoTitle?: string;
  seoDescription?: string;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IVariant>({
  size: { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'], required: true },
  color: { type: String, required: true },
  colorCode: { type: String, required: true },
  sku: { type: String, required: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  price: { type: Number, min: 0 },
});

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    titleBn: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    collections: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    costPrice: { type: Number, min: 0 },
    images: [{ type: String, required: true }],
    variants: [VariantSchema],
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    sizeGuide: { type: String },
    seoTitle: { type: String },
    seoDescription: { type: String },
    averageRating: { type: Number, default: 5.0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Text index for search
ProductSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
