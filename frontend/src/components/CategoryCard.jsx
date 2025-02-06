"use client"

import Image from 'next/image'
import Link from 'next/link'

// Temporary data - will be replaced with API fetch
const categories = [
  {
    id: 1,
    name: "Phones",
    image: "/images/categories/Category-CellPhone.png",
    slug: "phones"
  },
  {
    id: 2,
    name: "Computers",
    image: "/images/categories/Category-Computer.png",
    slug: "computers"
  },
  {
    id: 3,
    name: "SmartWatch",
    image: "/images/categories/Category-SmartWatch.png",
    slug: "smartwatches"
  },
  {
    id: 4,
    name: "Camera",
    image: "/images/categories/Category-Camera.png",
    slug: "cameras"
  },
  {
    id: 5,
    name: "HeadPhones",
    image: "/images/categories/Category-HeadPhone.png",
    slug: "headphones"
  },
  {
    id: 6,
    name: "Gaming",
    image: "/images/categories/Category-Gamepad.png",
    slug: "gaming"
  },
  // Add more categories as needed
]

const CategoryCard = () => {
  return (
    <div className="w-full mx-auto px-4 py-12">
        <div className='overflow-x-auto scrollbar-hide category-scroll-container'>
            <div className="flex flex-row gap-6 min-w-max pb-4">
            {categories.map((category) => (
                <Link
                    href={`/category/${category.slug}`}
                    key={category.id}
                    className="group"
                >
                    <div className="flex flex-col w-[170px] h-[145px] justify-center gap-4 p-4 bg-white border-[2px] border-gray-300 hover:border-red-500 rounded-md transition-transform duration-300 hover:bg-red-500">
                    <div>
                        <Image
                        src={category.image}
                        alt={category.name}
                        height={56}
                        width={56}
                        className="mx-auto group-hover:brightness-0 group-hover:invert"
                        sizes="(max-width: 768px) 96px, 96px"
                        loading="lazy"
                        />
                    </div>
                    <h3 className="text-center text-black font-medium group-hover:text-white">
                        {category.name}
                    </h3>
                    </div>
                </Link>
                ))}
            </div>
        </div>
    </div>
  )
}

export default CategoryCard;
