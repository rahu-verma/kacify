import { useEffect, useState } from "react";
import { editCartProduct, fetchCart, removeFromCart } from "../utils/api";
import { ProductType } from "../../../api/src/utils/types";

const Cart = () => {
  const [cart, setCart] = useState<
    {
      product: ProductType;
      quantity: number;
    }[]
  >([]);
  const loadCart = () => {
    fetchCart().then((response) => {
      if (response.success) {
        setCart(
          response.data.map((x) => ({
            product: x.product as ProductType,
            quantity: x.quantity,
          }))
        );
      } else {
        alert(response.message);
      }
    });
  };
  useEffect(() => {
    loadCart();
  }, []);
  return (
    <div className="p-4">
      Cart
      {cart?.map((cartItem, index) => (
        <div key={index} className="border w-max p-2 mt-2 flex gap-2">
          <span>{cartItem.product.name}</span>
          {cartItem.quantity > 1 && (
            <span
              className="cursor-pointer"
              onClick={() => {
                editCartProduct(
                  cartItem.product._id,
                  cartItem.quantity - 1
                ).then((response) => {
                  if (response.success) {
                    loadCart();
                  } else {
                    alert(response.message);
                  }
                });
              }}
            >
              -
            </span>
          )}
          <span>{cartItem.quantity}</span>
          <span
            className="cursor-pointer"
            onClick={() => {
              editCartProduct(cartItem.product._id, cartItem.quantity + 1).then(
                (response) => {
                  if (response.success) {
                    loadCart();
                  } else {
                    alert(response.message);
                  }
                }
              );
            }}
          >
            +
          </span>
          <span
            className="cursor-pointer"
            onClick={() => {
              removeFromCart(cartItem.product._id).then((response) => {
                if (response.success) {
                  loadCart();
                } else {
                  alert(response.message);
                }
              });
            }}
          >
            X
          </span>
        </div>
      ))}
    </div>
  );
};

export default Cart;
