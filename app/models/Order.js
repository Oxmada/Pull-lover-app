import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      firstname:  String,
      lastname:   String,
      email:      String,
      phone:      String,
      address:    String,
      postalCode: String,
      city:       String,
      country:    String,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: Number,
      },
    ],

    total: Number,

    stripePaymentId: {
      type: String,
      default: null,
    },

    // ✅ AJOUTER CE CHAMP
    payment: {
      type: String,
      enum: ["cash", "mobile_money", "card", "bank_transfer"],
      default: "cash",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    delivery: {
      method: {
        type: String,
        enum: ["colissimo_domicile", "colissimo_relais"],
        default: "colissimo_domicile",
      },
      trackingNumber: { type: String, default: null },
      labelUrl:       { type: String, default: null },
      relayId:        { type: String, default: null },
      shippedAt:      { type: Date,   default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);