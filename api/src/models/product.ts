import { Schema, model } from "mongoose";

export type TProduct = {
  _id: string;
  name: string;
  image: string;
  price: number;
};

const schema = new Schema<TProduct>({
  name: {
    type: String,
    required: true,
    minlength: 1,
  },
  image: {
    type: String,
    required: true,
    minlength: 1,
    validate: {
      validator: (v) => v.match(/^[A-Za-z0-9-.]+$/),
    },
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
});

schema.pre("save", function (next) {
  this.name = this.name.trim().replace(/[^A-Za-z0-9]/g, "");
  next();
});

export const ProductModelName = "Product";

const Product = model<TProduct>(ProductModelName, schema);

Product.syncIndexes();

export default Product;
