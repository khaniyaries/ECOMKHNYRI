import Link from "next/link";
import { LuSearch } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { GoPerson } from "react-icons/go";


const Navbar = () => {
    return(
        <div className="h-full w-full items-center border-b flex flex-row">
            <div className="lg:w-[25%] md:w-[20%] w-[10%]">
                <h1 className="font-extrabold text-2xl font-inter text-center">YAREES</h1>
            </div>
            <div className="w-[30%] flex flex-row justify-evenly font-poppins">
                <Link href='/' className="">Home</Link>
                <Link href='/' className="">Contact</Link>
                <Link href='/' className="">About</Link>
                <Link href='/' className="">Sign Up</Link>
            </div>
            <div className="w-[45%] flex flex-row justify-center gap-4">
                <div className="flex flex-row items-center relative">
                    <input 
                        type="search" 
                        className="h-8 w-[calc(100%+50px)] p-4 pr-6 placeholder:text-sm placeholder:font-poppins rounded-sm bg-[#F5F5F5] placeholder:text-slate-500" 
                        placeholder="What are you looking for?"
                    /> 
                    <LuSearch className="absolute right-3" />
                </div>
                <div className="p-2">
                    <FaRegHeart />
                </div>
                <div className="p-2">
                    <IoCartOutline />
                </div>
                <div className="bg-red-500 rounded-full p-2">
                    <GoPerson color="white"/>
                </div>

            </div>
        </div>
    )
}

export default Navbar;