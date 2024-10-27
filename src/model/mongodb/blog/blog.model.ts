import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    // image: {
    //   type: String,
    // },
    // name: { type: String, required: true },
    user_id: { type: String, required: true },
    // user_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
    type: {
      type: String,
      enum: [
        'History',
        'Food',
        'Pets',
        'Health',
        'Fashion',
        'Exercise',
        'Others',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: { type: String, required: true },
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

export const BlogModel = mongoose.model('blog', BlogSchema);
