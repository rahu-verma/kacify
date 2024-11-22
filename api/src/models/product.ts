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
    minlength: 1,
  },
  image: {
    type: String,
    required: true,
    minlength: 1,
    validate: {
      validator: (v) => v.match(/^[A-Za-z0-9-]+$/),
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

const Product = model<Product>("Product", schema);

Product.syncIndexes();

export default Product;
