import { FaExpandAlt, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartItem } from "../types/types";
import { transformImage } from "../utils/features";

type ProductsProps = {
  productId: string;
  photos: {
    url: string;
    public_id: string;
  }[];
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};

const ProductCard = ({
  productId,
  price,
  name,
  photos,
  stock,
  handler,
}: ProductsProps) => {
  return (
    <div className="product-card">
      <img src={photos?.[0]?.url ? transformImage(photos[0].url, 400) : 'default-image.jpg'} alt={name || 'Product Image'} />
      <p>{name}</p>
      <span>₹{price}</span>
      <div className="product-actions">
        <button
          onClick={() =>
            handler({
              productId,
              price,
              name,
              photo: photos[0]?.url || "/path/to/default-image.jpg", 
              stock,
              quantity: 1,
            })
          }
          disabled={stock <= 0} 
        >
          <FaPlus />
        </button>

        <Link to={`/product/${productId}`}>
          <FaExpandAlt />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
