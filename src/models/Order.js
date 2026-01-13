import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  tableNumber: { type: Number, required: true },
  customer: {
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    email: String
  },
  items: [{
    dishId: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
    name: String,  // Snapshot
    price: Number, // Snapshot
    quantity: { type: Number, required: true },
    notes: String
  }],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["in_preparation", "served", "completed", "canceled"],
    default: "in_preparation"
  },
  payment: {
    method: { type: String, enum: ["card", "cash", "mobile money"] },
    tip: { type: Number, default: 0 }
  },
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
