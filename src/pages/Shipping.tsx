import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RootState } from "../redux/Store";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart, saveShippingInfo } from "../redux/reducer/cartReducer";
import { NewOrderRequest } from "../types/api-types";
import { paymentHandler } from "./PaymentGateway";
const Shipping = () => {
  const { orderItems, total } = useSelector(
    (state: RootState) => state.cartReducer
  );
  const user = useSelector((state: RootState) => state.userReducer.user?._id);

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: 0,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [newOrder] = useNewOrderMutation();

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { subtotal, tax, discount, shippingCharges } = useSelector(
    (state: RootState) => state.cartReducer
  );
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveShippingInfo(shippingInfo));

    const orderData: NewOrderRequest = {
      shippingInfo,
      orderItems,
      subtotal,
      tax,
      discount,
      shippingCharges,
      total,
      user: user || "",
    };

    try {
      const finalCall = await paymentHandler(e, total);

      if (finalCall) {
        await newOrder(orderData);
        navigate("/");
        dispatch(resetCart());
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    if (orderItems.length <= 0) return navigate("/cart");
  }, []);

  return (
    <div className="shipping">
      <button className="back-btn " onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>
      <form onSubmit={submitHandler}>
        <h1>Shipping Address</h1>
        <input
          required
          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />
        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
        />

        <input
          required
          type="text"
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
        />
        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value="">Choose Country</option>
          <option value="India">India</option>
          <option value="USA">USA</option>
        </select>

        <input
          required
          type="number"
          placeholder="Pin Code"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Shipping;
