import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa6";
import { server } from "../redux/Store";
import { CartItem } from "../types/types";
type CartItemProps = {
  cartItem: any;
  incrementHandler: (cartItem: CartItem) => void;
  decrementHandler: (cartItem: CartItem) => void;
  removeHandler: (id: string) => void;
};

const CartItemCard = ({
  cartItem,
  incrementHandler,
  removeHandler,
  decrementHandler,
}: CartItemProps) => {
  const { photo, productId, name, price, quantity } = cartItem;

  return (
    <div className="cart-item">
      <img src={`${server}/${photo}`} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>

      <div>
        <button onClick={() => decrementHandler(cartItem)}>-</button>
        <p>{quantity}</p>
        <button onClick={() => incrementHandler(cartItem)}>+</button>
      </div>

      <button>
        <FaTrash onClick={() => removeHandler(productId)} />
      </button>
    </div>
  );
};

export default CartItemCard;
