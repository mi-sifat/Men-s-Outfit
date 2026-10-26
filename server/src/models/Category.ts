import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  nameBn?: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  order: number;
  showOnHome: boolean;
  showInNav: boolean;
  parentCategory?: mongoose.Types.ObjectId;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    nameBn: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String },
    image: { type: String },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    showOnHome: { type: Boolean, default: true },
    showInNav: { type: Boolean, default: true },
    parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
