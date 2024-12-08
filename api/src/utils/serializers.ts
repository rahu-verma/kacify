import { TProduct } from "../models/product";
import { TUser } from "../models/user";
import { ProductRouterSerializerSchema } from "./zod";

export const ProductRouterSerializer = (product: TProduct) => {
  const data = {
    _id: product._id,
    name: product.name,
    price: product.price,
    image: product.image,
  };
  const results = ProductRouterSerializerSchema.safeParse(data);
  if (!results.success) return null;
  return {
    product: results.data,
  };
};

export const UserRouterProfileSerializer = (user: TUser) => {
  return {
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  };
};
