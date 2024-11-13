import { createContext, useContext, useEffect, useState } from "react";
import { fetchAllProducts } from "../api/product";
import { ProductType } from "../types/product";

type ProductContextType = {
  products: ProductType[];
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  isLoading: true,
});

export const ProductProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    fetchAllProducts()
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <ProductContext.Provider value={{ products, isLoading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  return context;
};
