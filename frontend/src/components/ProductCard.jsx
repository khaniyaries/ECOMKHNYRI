import { Heart, Eye } from "lucide-react";
import { IoTrashOutline } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { useCart } from '@/hooks/useCart.js';
import Image from "next/image";

const ProductCard = ({ name, image, price, originalPrice, discount, rating, reviews, isWishlist }) => {

  
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    addToCart(product._id, 1);
  };

  if (isWishlist) {
    return (
      <div className="relative bg-white rounded-lg p-4 group ">
      <div className="relative aspect-square mb-4 border bg-gray-100 rounded-md">
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-red-500 text-white px-2 py-1 text-sm font-medium rounded">-{discount}%</span>
        </div>
        <div className="absolute top-2 right-2 z-10 space-y-2">
          <button className="bg-white p-2 rounded-full shadow-sm hover:scale-110 transition-transform">
            <IoTrashOutline/>
          </button>
        </div>
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-contain" />
        <div className="absolute bottom-0 w-full">
          <button className="w-full p-1 bg-black text-white md:py-2 flex flex-row justify-center gap-1 md:gap-2 rounded-b-md">
            <IoCartOutline className="h-3 w-3 md:h-5 md:w-5"/> 
            <h1 className="text-xs md:text-base">Add To Cart</h1>
          </button>
        </div> 
      </div>
      <h3 className="font-medium text-lg mb-2">{name}</h3>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-500 font-bold">${price}</span>
        <span className="text-gray-400 line-through">${originalPrice}</span>
      </div>
    </div>
    );
  }

  return (
    <div className="relative bg-white rounded-lg p-4 group">
      <div className="relative aspect-square mb-4 border bg-gray-100 rounded-md">
        <div className="flex flex-row justify-between p-2">
          <div className="top-2 left-2 z-10">
            <span className="bg-red-500 text-white px-2 py-1 text-sm font-medium rounded">-{discount}%</span>
          </div>
          <div className="flex flex-col w-max justify-end top-2 right-2 z-10 space-y-2">
            <button className="bg-white p-2 rounded-full shadow-sm hover:scale-110 transition-transform">
              <Heart className="w-5 h-5" />
            </button>
            <button className="bg-white p-2 rounded-full shadow-sm hover:scale-110 transition-transform">
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-contain" />
        <div className="absolute bottom-0 w-full">
          <button 
            onClick={handleAddToCart}
            className="w-full p-1 bg-black text-white md:py-2 flex flex-row justify-center gap-1 md:gap-2 rounded-b-md">
            <IoCartOutline className="h-3 w-3 md:h-5 md:w-5"/> 
            <h1 className="text-xs md:text-base">Add To Cart</h1>
        </button>
        </div> 
      </div>
      <h3 className="font-medium text-lg mb-2">{name}</h3>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-500 font-bold">${price}</span>
        <span className="text-gray-400 line-through">${originalPrice}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-2xl ${i < rating ? "text-yellow-400" : "text-gray-200"}`}>
              ★
            </span>
          ))}
        </div>
        <span className="text-gray-500">({reviews})</span>
      </div>
    </div>
  );
};

export default ProductCard;
