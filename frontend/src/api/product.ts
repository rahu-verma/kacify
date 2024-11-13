import axios from "axios";
import { Product } from "../types/product";

export const fetchAllProducts = async (): Promise<Product[]> => {
  const url = process.env.REACT_APP_API_URL + "/product";
  const response = await axios.get(url);
  return response.data.data.products;
};
