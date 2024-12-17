import { useEffect, useState } from "react";
import { fetchProducts } from "../utils/api";
import { ProductType } from "../../../api/src/utils/types";

const Products = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  useEffect(() => {
    fetchProducts().then((response) => {
      setProducts(response.data);
    });
  }, []);

  return (
    <div>
      {products?.map((product: any) => (
        <div key={product._id}>
          <img src={product.image} alt={product.name} />
          <div>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
