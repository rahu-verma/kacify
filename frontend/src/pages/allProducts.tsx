import { useEffect, useState } from "react";
import {
  deleteProduct,
  fetchVendorProducts,
  fetchAllProducts,
  editProduct,
} from "../utils/api";
import { ProductType } from "../../../api/src/utils/types";
import AddProduct from "./addProduct";

const AllProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const loadProducts = async () => {
    fetchAllProducts().then((response) => {
      if (!response.success) {
        alert(response.message);
      } else {
        setProducts(response.data);
      }
    });
  };
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="p-10">
      <div className="mt-10 border">
        <h1>All Products</h1>
        {products?.map((product: any) => (
          <div
            key={product._id}
            className="border w-40 h-40 flex flex-col justify-center items-center"
          >
            <img src={product.image} alt={product.name} className="w-20 h-20" />
            <div>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
