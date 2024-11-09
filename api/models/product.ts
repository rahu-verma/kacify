import { Schema, model, models } from "mongoose";

export interface Product {
  name: string;
  image: string;
  price: number;
  description: string;
}

const schema = new Schema<Product>({
  name: String,
  image: String,
  price: Number,
  description: String,
});

const ProductModel = models.Product<Product> || model<Product>("Product", schema);

export default ProductModel;
