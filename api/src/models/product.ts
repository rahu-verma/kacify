import { Schema, Types, model } from "mongoose";
import { ProductType } from "../utils/types";
import { UserModelName } from "./user";

const schema = new Schema<ProductType>({
  name: {
    type: String,
    required: true,
    minlength: 1,
  },
  image: {
    type: String,
    required: true,
    minlength: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
  },
  user: {
    type: Types.ObjectId,
    ref: UserModelName,
    required: true,
  }
});

export const ProductModelName = "Product";

const ProductModel = model<ProductType>(ProductModelName, schema);

ProductModel.syncIndexes();

export default ProductModel;
