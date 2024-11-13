import axios from "axios";

export const fetchAllProducts = async () => {
  const url = process.env.REACT_APP_API_URL + "/product";
  const response = await axios.get(url);
  return response.data;
};
