import Link from "next/link";
const SaleHeader = () => {

    

    return(
        <div className="w-full h-full flex bg-black text-white items-center">
            <div className="mx-auto">
                <h1 className="text-sm font-poppins font-normal">
                    Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
                    <Link 
                    href="/products"
                    className="ml-2 font-semibold underline"
                    > 
                        ShopNow
                    </Link>
                </h1>
            </div>
            <div className="pr-4">
                <select className="appearance-none bg-black border-none outline-none cursor-pointer pr-6 text-sm font-poppins">
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                </select>
                <svg className="w-4 h-4 -ml-6 pointer-events-none inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    )
}

export default SaleHeader;