import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { Link } from "react-router-dom";
import CartItem from "../components/cart-item";
const cartItems = [{
  productId:"fgjodigj[r",
  photo:"https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba13-midnight-config-202402?wid=820&hei=498&fmt=jpeg&qlt=90&.v=1708371033110",
  name:"Macbook",
  price:3000,
  quantity:4,
  stock:10,
  },
];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18)
const shippingCharges = 200;
const total = subtotal + tax + shippingCharges;
const discount = 400;
const Cart = () => {

  const [cuponCode  , setCuponCode] = useState<string>("");
  const [isValidcuponCode  , setisValidCuponCode] = useState<boolean>(false);

  useEffect(()=>{
    const timeOutId = setTimeout(()=>{
      if(Math.random()>0.5)setisValidCuponCode(true);
      else setisValidCuponCode(false);
    } , 1000);

    return () => {
      clearTimeout(timeOutId);
      setisValidCuponCode(false);
    };
  } , [cuponCode])
  
  return (
    <div className="cart">
      <main>
        {
          cartItems.map((i , idx)=>(
            <CartItem key={idx} cartItem={i}/>
          ))
        }
      </main>
      <aside>
        <p>Subtotal:  Rs{subtotal}</p>
        <p>ShippingCharges:  Rs{shippingCharges}</p>
        <p>Tax: Rs{tax}</p>
        <p>
          Discount: <em> - Rs{discount}</em>
        </p>
        <p>
          <b>Total: Rs{total}</b>
        </p>
        <input type="text"placeholder="Cupon Code" value={cuponCode} onChange={(e)=> setCuponCode(e.target.value)}/>
        {
          cuponCode && 
          (isValidcuponCode?
            (<span className="green">Rs{discount} off using the <code>{cuponCode}</code></span>
            ):(<span className="red">Invalid Cupon <VscError/></span>)
          )
        }

      {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  )
}

export default Cart
