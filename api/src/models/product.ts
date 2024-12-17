import { Schema, model } from "mongoose";
import { ProductType } from "../utils/types";

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
});

export const ProductModelName = "Product";

const ProductModel = model<ProductType>(ProductModelName, schema);

ProductModel.syncIndexes();

export default ProductModel;
