import { usePathname } from 'next/navigation'
import Link from "next/link"
const SidebarContent = () => {
    const pathname = usePathname()

    const linkStyle = (path) => {
        return `font-poppins font-normal text-base ${
        pathname === path 
            ? "text-red-500 hover:text-red-600" 
            : "text-black/50 hover:text-black/70"
        }`
    }
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-medium font-poppins text-base mb-2">Manage My Account</h3>
          <ul className="space-y-2 ml-4 text-sm">
            <li>
              <Link href="/user/myaccount" className={`${linkStyle('/user/myaccount')} font-poppins font-normal text-base`}>
                My Profile
              </Link>
            </li>
            <li>
              <Link href="/user/address" className={`${linkStyle('/user/address')} font-poppins font-normal text-base`}>
                Address Book
              </Link>
            </li>
            <li>
              <Link href="/user/payment-book" className={`${linkStyle('/user/payment-book')} font-poppins font-normal text-base`}>
                My Payment Options
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-medium font-poppins text-base mb-2">My Orders</h3>
          <ul className="space-y-2 ml-4  text-sm">
            <li>
              <Link href="/user/returns" className={`${linkStyle('/user/returns')} font-poppins font-normal text-base`}>
                My Returns
              </Link>
            </li>
            <li>
              <Link href="/user/cancellations" className={`${linkStyle('/user/cancellations')} font-poppins font-normal text-base`}>
                My Cancellations
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-medium font-poppins text-base mb-2">My Wishlist</h3>
        </div>
      </div>
    )
};

export default SidebarContent;