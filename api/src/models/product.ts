import { Schema, model } from "mongoose";
import { Product } from "../types/product";

const schema = new Schema<Product>({
  name: String,
  image: String,
  price: Number,
});

const Product = model<Product>("Product", schema);

export default Product;
