import { Schema, Types, model } from "mongoose";
import { TUser, UserModelName } from "./user";
import { ProductModelName, TProduct } from "./product";

export type CartType = {
  _id: string;
  user: TUser | Types.ObjectId;
  products: { product: TProduct | Types.ObjectId; quantity: number }[];
};

const schema = new Schema<CartType>({
  user: {
    type: Schema.Types.ObjectId,
    ref: UserModelName,
    required: true,
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: ProductModelName,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
});

export const CartModelName = "Cart";

const CartModel = model<CartType>(CartModelName, schema);

CartModel.syncIndexes();

export default CartModel;
