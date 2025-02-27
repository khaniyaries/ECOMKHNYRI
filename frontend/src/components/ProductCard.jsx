import { Heart, Eye } from "lucide-react";
import { IoTrashOutline } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { useCart } from '@/hooks/useCart.js';
import toast from "react-hot-toast";
import Image from "next/image";

const ProductCard = ({ _id, name, images, price, percentageOff, averageRating, reviews, isWishlist }) => {
  const { addToCart } = useCart();
  
  const primaryImage = images?.find(img => img.isPrimary)?.url || images?.[0]?.url || "/images/placeholder.svg";
  const discountedPrice = price - (price * (percentageOff / 100));
  
  const handleAddToCart = (e) => {
    e.preventDefault() // Prevents the link navigation
    e.stopPropagation() 
    try{
    addToCart(_id, 1);
    toast.success("Product Added to Cart successfully")
    }catch(error){
      console.log(error)
    }
    
  };

  if (isWishlist) {
    return (
      <div className="relative bg-white rounded-lg p-4 group">
        <div className="relative aspect-square mb-4 border bg-gray-100 rounded-md">
          <div className="absolute top-2 left-2 z-10">
            {percentageOff > 0 && (
              <span className="bg-red-500 text-white px-2 py-1 text-sm font-medium rounded">-{percentageOff}%</span>
            )}
          </div>
          <div className="absolute top-2 right-2 z-10 space-y-2">
            <button className="bg-white p-2 rounded-full shadow-sm hover:scale-110 transition-transform">
              <IoTrashOutline/>
            </button>
          </div>
          <Image src={primaryImage} alt={name} fill className="object-contain" />
          <div className="absolute bottom-0 w-full">
            <button className="w-full p-1 bg-black text-white md:py-2 flex flex-row justify-center gap-1 md:gap-2 rounded-b-md">
              <IoCartOutline className="h-3 w-3 md:h-5 md:w-5"/> 
              <h1 className="text-xs md:text-base">Add To Cart</h1>
            </button>
          </div> 
        </div>
        <h3 className="font-medium text-lg mb-2">{name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-500 font-bold">₹{discountedPrice.toFixed(2)}</span>
          {percentageOff > 0 && (
            <span className="text-gray-400 line-through">₹{price.toFixed(2)}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-lg p-4 group">
      <div className="relative aspect-square mb-4 border bg-gray-100 rounded-md">
        <div className="flex flex-row justify-between p-2">
          <div className="top-2 left-2 z-10">
            {percentageOff > 0 && (
              <span className="bg-red-500 text-white px-2 py-1 text-sm font-medium rounded">-{percentageOff}%</span>
            )}
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
        <Image src={primaryImage} alt={name} fill className="object-contain" />
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
        <span className="text-red-500 font-bold">₹{discountedPrice.toFixed(2)}</span>
        {percentageOff > 0 && (
          <span className="text-gray-400 line-through">₹{price.toFixed(2)}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-2xl ${i < averageRating ? "text-yellow-400" : "text-gray-200"}`}>
              ★
            </span>
          ))}
        </div>
        <span className="text-gray-500">({reviews.length})</span>
      </div>
    </div>
  );
};

export default ProductCard;
