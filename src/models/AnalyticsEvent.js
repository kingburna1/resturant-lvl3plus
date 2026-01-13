import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  type: { type: String, required: true },
  userId: String,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

export default mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', AnalyticsSchema);
