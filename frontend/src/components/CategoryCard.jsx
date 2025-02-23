"use client"
import Image from 'next/image'
import Link from 'next/link'

const CategoryCard = ({ categories }) => {
  if (!categories?.length) {
    return <div className="w-full mx-auto px-4 py-12 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
    </div>
  }

  return (
    <div className="w-full mx-auto px-4 py-12">
      <div className='overflow-x-auto scrollbar-hide category-scroll-container'>
        <div className="flex flex-row gap-6 min-w-max pb-4">
          {categories.map((category) => (
            <Link
              href={`/products/${category._id}`}
              key={category._id}
              className="group"
            >
              <div className="flex flex-col w-[170px] h-[145px] justify-center gap-4 p-4 bg-white border-[2px] border-gray-300 hover:border-red-500 rounded-md transition-transform duration-300 hover:bg-red-500">
                <div>
                  <Image
                    src={category.image?.url||"/images/placeholder.svg"}
                    alt={category.name}
                    height={56}
                    width={56}
                    className="mx-auto"
                    sizes="(max-width: 768px) 136px, 136px"
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

export default CategoryCard
