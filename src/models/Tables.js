import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  location: { 
    type: String, 
    enum: ["inside", "terrace"], 
    required: true 
  },
  capacity: { type: Number, required: true },
  isOccupied: { type: Boolean, default: false } // Helpful for real-time status
});

export default mongoose.models.Table || mongoose.model("Table", TableSchema);
