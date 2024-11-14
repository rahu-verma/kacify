import { createContext, useContext, useEffect, useState } from "react";
import { fetchProducts, Product } from "../utils/api";

const Context = createContext<{
  products: Product[];
  isLoading: boolean;
}>({
  products: [],
  isLoading: true,
});

export const ProductProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Context.Provider value={{ products, isLoading }}>
      {children}
    </Context.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(Context);
  return context;
};
