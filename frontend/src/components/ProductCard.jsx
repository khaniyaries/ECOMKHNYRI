import { Heart, Eye } from "lucide-react";
import Image from "next/image";

const ProductCard = ({ name, image, price, originalPrice, discount, rating, reviews }) => {
  return (
    <div className="relative bg-white rounded-lg p-4 group">
      <div className="relative aspect-square mb-4">
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-red-500 text-white px-2 py-1 text-sm font-medium rounded">-{discount}%</span>
        </div>
        <div className="absolute top-2 right-2 z-10 space-y-2">
          <button className="bg-white p-2 rounded-full shadow-sm hover:scale-110 transition-transform">
            <Heart className="w-5 h-5" />
          </button>
          <button className="bg-white p-2 rounded-full shadow-sm hover:scale-110 transition-transform">
            <Eye className="w-5 h-5" />
          </button>
        </div>
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-contain" />
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
      <button className="w-full bg-black text-white py-2 mt-4 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
        Add To Cart
      </button>
    </div>
  );
};

export default ProductCard;
