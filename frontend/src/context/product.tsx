import { createContext, useContext, useEffect, useState } from "react";
import { fetchProducts, Product } from "../utils/api";
import { useNavigationContext } from "./navigation";

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
  const { setPage } = useNavigationContext();

  useEffect(() => {
    fetchProducts()
      .then((response) => {
        setProducts(response.data.products);
        setPage("products");
      })
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
