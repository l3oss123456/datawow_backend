import mongoose from 'mongoose';

const BlogCommentSchema = new mongoose.Schema(
  {
    // image: {
    //   type: String,
    // },
    blog_id: { type: String, required: true },
    user_id: { type: String, required: true },
    comment_text: {
      type: String,
    },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: {
      // currentTime: () => Math.floor(Date.now() / 1000), // Convert timestamps to Unix time
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export const BlogCommentModel = mongoose.model(
  'blog_comment',
  BlogCommentSchema,
);
