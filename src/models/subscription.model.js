import mongoose from 'mongoose';

// Define the subscription schema
const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Export the subscription model
export default mongoose.model('Subscription', subscriptionSchema);
