import { Schema, model } from "mongoose";
import { ProductType } from "../types/product";

const schema = new Schema<ProductType>({
  name: String,
  image: String,
  price: Number,
});

const ProductModel = model<ProductType>("Product", schema);

export default ProductModel;
