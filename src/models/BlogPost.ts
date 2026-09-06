import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  cluster: string;
  ciudad?: string;
  published: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: '' },
    tags: [String],
    cluster: { type: String, default: 'general' },
    ciudad: String,
    published: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ tags: 1, published: 1 });
BlogPostSchema.index({ cluster: 1 });

export const BlogPost =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
