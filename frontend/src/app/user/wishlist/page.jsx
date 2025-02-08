import WishList from "@/components/WishList";
import ForYou from "@/components/ForYou";
const WishListPage = () => {
    return(
      
    <main className="container w-full h-full mx-auto px-4 md:px-10 lg:px-40 py-20">
        <nav className="mb-8 flex flex-row justify-between">
            <h1 className="text-xl font-poppins font-normal">
            Wishlist (04)
            </h1>
            <button className="bg-white -mt-2 text-black text-base font-poppins font-medium py-2 px-8 rounded-md border border-black/50">
                Move All To Bag
            </button>
        </nav>
        <WishList />

        <div className="flex justify-between items-start w-full">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-5 h-10 bg-red-500 rounded" />
                <span className="font-normal font-poppins text-xl">Just For You</span>
            </div>
            <button className="bg-white text-black text-base font-poppins font-medium py-2 px-8 rounded-md border border-black/50">
                See All
            </button>
        </div>
        <ForYou />
    </main>
    )
};
export default WishListPage;