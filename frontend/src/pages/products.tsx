import Spinner from "../components/spinner";
import { useProductContext } from "../context/product";

const Products = () => {
  const { products, isLoading: isProductContextLoading } = useProductContext();

  return (
    <div>
      {isProductContextLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-wrap gap-5 justify-between">
          {products?.map((product) => (
            <div
              key={product._id}
              className="flex flex-col w-80 shadow-md rounded-lg overflow-hidden border-[0.5px] border-primary-light cursor-pointer hover:opacity-50 h-max"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-80 h-72 border-b-[0.5px] border-primary-light"
              />
              <div className="flex justify-between items-center p-2">
                <h3 className="uppercase text-2xl font-bold">{product.name}</h3>
                <p className="text-2xl font-bold border-l-[0.5px] border-primary-light pl-3">
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
