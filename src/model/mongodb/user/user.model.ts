import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    username: { type: String, required: true, unique: true },
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

export const UserModel = mongoose.model('user', UserSchema);
