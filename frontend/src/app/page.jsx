import Image from "next/image";
import FlashSales from "@/components/FlashSale.jsx";

export default function Home() {

  const categories = [
    "Women's Fashion",
    "Men's Fashion",
    "Electronics",
    "Home & Lifestyle",
    "Medicine",
    "Sports & Outdoor",
    "Baby's & Toys",
    "Groceries & Pets",
    "Health & Beauty",
  ];

  return (
    <div className="w-full h-full">
      <div className="flex p-20 px-40 flex-row w-full justify-evenly">
        <div className="w-[15%] flex-col">
          {categories.map((category) => (
              <div key={category} className="group">
                <a
                  href="#"
                  className="py-2 text-black font-poppins font-normal relative w-full flex justify-between items-center"
                >
                  {category}
                  {(category === "Women's Fashion" || category === "Men's Fashion") && (
                    <span className="text-black font-bold">›</span>
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 ease-in-out group-hover:w-full"></span>
                </a>
              </div>
            ))}
        </div>
        {/* <div className="border-l border-black mx-8 h-[360px]" /> */}
        <div className="w-[70%] bg-black">
          
        </div>

      </div>
      <FlashSales/>
    </div>
  );
}
