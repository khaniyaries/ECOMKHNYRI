import { usePathname } from 'next/navigation'
import Link from "next/link"
const SidebarContent = ({ setIsMenuOpen }) => {
    const pathname = usePathname()

    const linkStyle = (path) => {
        return `font-poppins font-normal text-base ${
        pathname === path 
            ? "text-red-500 hover:text-red-600" 
            : "text-black/50 hover:text-black/70"
        }`
    }

    const handleLinkClick = () => {
      setIsMenuOpen?.(false)
    }

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-medium font-poppins text-base mb-2">Manage My Account</h3>
          <ul className="space-y-2 ml-4 text-sm">
            <li>
              <Link 
              href="/user/myaccount" 
              className={`${linkStyle('/user/myaccount')} font-poppins font-normal text-base`}
              onClick={handleLinkClick}
              >
                My Profile
              </Link>
            </li>
            <li>
              <Link 
              href="/user/myaccount/manage-address" 
              className={`${linkStyle('/user/myaccount/manage-address')} font-poppins font-normal text-base`}
              onClick={handleLinkClick}
              >
                Address Book
              </Link>
            </li>
            <li>
              <Link 
              href="/user/myaccount/payment-options" 
              className={`${linkStyle('/user/myaccount/payment-options')} font-poppins font-normal text-base`}
              onClick={handleLinkClick}
              >
                My Payment Options
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-medium font-poppins text-base mb-2">My Orders</h3>
          <ul className="space-y-2 ml-4  text-sm">
            <li>
              <Link 
              href="/user/myaccount/returns" 
              className={`${linkStyle('/user/myaccount/returns')} font-poppins font-normal text-base`}
              onClick={handleLinkClick}
              >
                My Returns
              </Link>
            </li>
            <li>
              <Link 
              href="/user/myaccount/cancellations" 
              className={`${linkStyle('/user/myaccount/cancellations')} font-poppins font-normal text-base`}
              onClick={handleLinkClick}
              >
                My Cancellations
              </Link>
            </li>
          </ul>
        </div>
        <Link
        href="/user/wishlist"
        >
          <h3 className="font-medium font-poppins text-base mb-2 mt-4">My Wishlist</h3>
        </Link>
      </div>
    )
};

export default SidebarContent;