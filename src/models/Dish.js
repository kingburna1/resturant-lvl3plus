import mongoose from "mongoose";

const DishSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    enum: ["starter", "main course", "dessert", "drink"], 
    required: true 
  },
  description: String,
  price: { type: Number, required: true },
  ingredients: [String],
  allergens: [String],
  prepTime: Number,
  isAvailable: { type: Boolean, default: true },
  isVegetarian: Boolean,
  calories: Number,
  averageRating: { type: Number, default: 0 },
  chefName: String,
  photoUrl: String
}, { timestamps: true });

export default mongoose.models.Dish || mongoose.model("Dish", DishSchema);
