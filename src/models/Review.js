import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  author: {
    name: String,
    phone: String,
    email: String
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
