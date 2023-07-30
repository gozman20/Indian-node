const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

        count: Number,
        color: String,
      },
    ],
    paymentIntent: {},
    orderby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderStatus: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Cash on delivery",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Delivered",
      ],
    },
    orderBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);
