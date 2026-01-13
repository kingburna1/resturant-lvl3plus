import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
  quantity: { type: Number, default: 1 }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: { type: String, unique: true, required: true },
  email: { type: String, unique: false },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }],
  cart: [CartItemSchema],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
