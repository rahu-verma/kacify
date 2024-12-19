import { useEffect, useState } from "react";
import { ProductType } from "../../../api/src/utils/types";
import { deleteProduct, fetchVendorProducts } from "../utils/api";
import AddProduct from "./addProduct";
import EditProduct from "./editProduct";

const VendorProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const loadProducts = async () => {
    fetchVendorProducts().then((response) => {
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

  const [editProduct, setEditProduct] = useState<ProductType | null>(null);

  return (
    <div className="p-10">
      <div className="border">
        <AddProduct onSuccess={loadProducts} />
      </div>
      {editProduct && (
        <div className="border">
          <EditProduct
            productId={editProduct?._id}
            name={editProduct?.name}
            price={editProduct?.price}
            image={editProduct?.image}
            description={editProduct?.description}
            onSuccess={loadProducts}
          />
        </div>
      )}
      <div className="mt-10 border">
        <h1>All Products</h1>
        {products?.map((product) => (
          <div
            key={product._id}
            className="border p-4 flex flex-col justify-center items-center w-max"
          >
            <img src={product.image} alt={product.name} className="w-20 h-20" />
            <div>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </div>

            <span
              className="cursor-pointer text-2xl"
              onClick={() =>
                deleteProduct(product._id).then((response) => {
                  if (!response.success) {
                    alert(response.message);
                  } else {
                    loadProducts();
                  }
                })
              }
            >
              X
            </span>
            <span
              className="cursor-pointer text-xl border"
              onClick={() => {
                setEditProduct(product);
              }}
            >
              edit
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorProducts;
