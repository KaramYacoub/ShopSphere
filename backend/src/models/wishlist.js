import { model, Schema } from "mongoose";

const wishListSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

wishListSchema.index({ userId: 1, productId: 1 }, { unique: true });

wishListSchema.pre("save", async function (next) {
  const existingItem = await this.constructor.findOne({
    userId: this.userId,
    productId: this.productId,
  });

  if (existingItem) {
    const error = new Error("Product already in wishlist");
    return next(error);
  }

  next();
});

export default model("WishList", wishListSchema);
