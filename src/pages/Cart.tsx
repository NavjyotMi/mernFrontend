import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "../components/CartItem";
import { server } from "../redux/Store";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
} from "../redux/reducer/cartReducer";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";

function Cart() {
  const dispatch = useDispatch();
  const { orderItems, subtotal, tax, total, discount, shippingCharges } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );

  const [couponCodde, setCouponCode] = useState<string>("");
  const [isValidCouponCodde, setIsValidCouponCode] = useState<boolean>(false);

  const incrementHandler = (orderItems: CartItem) => {
    if (orderItems.quantity >= orderItems.stock)
      return toast.error("Max quantity reached");
    dispatch(addToCart({ ...orderItems, quantity: orderItems.quantity + 1 }));
  };

  const decrementHandler = (orderItems: CartItem) => {
    if (orderItems.quantity <= 1) return toast.error("Can't go beyond this");

    dispatch(addToCart({ ...orderItems, quantity: orderItems.quantity - 1 }));
  };

  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  useEffect(() => {
    const { token: cancelToken, cancel } = axios.CancelToken.source();
    const timeOutid = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCodde}`, {
          cancelToken,
        })
        .then((res) => {
          dispatch(discountApplied(res.data.discount));
          setIsValidCouponCode(true);
          dispatch(calculatePrice());
        })
        .catch(() => {
          dispatch(discountApplied(0));
          setIsValidCouponCode(false);
          dispatch(calculatePrice());
        });
    }, 1000);
    return () => {
      clearTimeout(timeOutid);
      cancel();
      setIsValidCouponCode(false);
    };
  }, [couponCodde]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [orderItems]);

  return (
    <div className="cart">
      <main>
        {orderItems.length > 0 ? (
          orderItems.map((i, idx) => {
            return (
              <CartItemCard
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                removeHandler={removeHandler}
                key={idx}
                cartItem={i}
              />
            );
          })
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal: ₹ {subtotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>tax: ₹{tax}</p>
        <p>
          Discount: -<em>${discount}</em>
        </p>
        <p>
          <b>Total: ₹{total}</b>
        </p>

        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCodde}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCodde &&
          (isValidCouponCodde ? (
            <span className="green">
              ${discount} off using the <code>{couponCodde}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}

        {orderItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
}

export default Cart;
