import { Schema, model } from "mongoose";

export type Product = {
  _id: string;
  name: string;
  image: string;
  price: number;
};

const schema = new Schema<Product>({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Product = model<Product>("Product", schema);

Product.syncIndexes();

export default Product;
