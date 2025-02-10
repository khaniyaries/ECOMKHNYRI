"use client"

import Image from "next/image"
import Link from "next/link"

export default function CheckoutPage() {
  return (
    <div className="container mx-auto w-full h-full px-4 md:px-10 lg:px-40 py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[8px] md:text-sm text-muted-foreground mb-8 md:mb-16">
        <Link href="/user/account" className="text-black/50">Account /</Link>
        <Link href="/user/my-account" className="text-black/50">My Account /</Link>
        <Link href="/user/products" className="text-black/50">Product /</Link>
        <Link href="/user/cart" className="text-black/50">View Cart /</Link>
        <span className="text-black">Checkout</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Billing Details */}
        <div>
          <h2 className="lg:text-4xl text-2xl font-inter font-medium mb-6">Billing Details</h2>
          <form className="space-y-4 text-black/50">
            <div>
              <label htmlFor="firstName" className="block mb-2">First Name <span className="text-red-500">*</span></label>
              <input id="firstName" required className="w-[90%] md:w-full bg-black/5 px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label htmlFor="companyName" className="block mb-2">Company Name</label>
              <input id="companyName" className="w-[90%] md:w-full px-3 py-2 bg-black/5 border rounded-md" />
            </div>
            <div>
              <label htmlFor="streetAddress" className="block mb-2">Street Address<span className="text-red-500">*</span></label>
              <input id="streetAddress" required className="w-[90%] md:w-full bg-black/5 px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label htmlFor="apartment" className="block mb-2">Apartment, floor, etc. (optional)</label>
              <input id="apartment" className="w-[90%] md:w-full px-3 py-2 bg-black/5 border rounded-md" />
            </div>
            <div>
              <label htmlFor="townCity" className="block mb-2">Town/City<span className="text-red-500">*</span></label>
              <input id="townCity" required className="w-[90%] md:w-full px-3 py-2 bg-black/5 border rounded-md" />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2">Phone Number<span className="text-red-500">*</span></label>
              <input id="phone" type="tel" required className="w-[90%] md:w-full px-3 py-2 bg-black/5 border rounded-md" />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2">Email Address<span className="text-red-500">*</span></label>
              <input id="email" type="email" required className="w-[90%] md:w-full px-3 py-2 bg-black/5 border rounded-md" />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="saveInfo" className="rounded border-gray-300 h-4 accent-red-500 w-4" />
              <label htmlFor="saveInfo" className="text-black text-sm md:text-base">Save this information for faster check-out next time</label>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 p-6 rounded-lg">
            {/* Products */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Q6bgE2AZZJjZhRM7Cd4OHn3fFRJ6Lr.png"
                    alt="LCD Monitor"
                    width={48}
                    height={48}
                    className="rounded-md"
                  />
                  <span>LCD Monitor</span>
                </div>
                <span>$650</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Q6bgE2AZZJjZhRM7Cd4OHn3fFRJ6Lr.png"
                    alt="H1 Gamepad"
                    width={48}
                    height={48}
                    className="rounded-md"
                  />
                  <span>H1 Gamepad</span>
                </div>
                <span>$1100</span>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between border-b border-black/50 pb-4">
                <span>Subtotal:</span>
                <span>$1750</span>
              </div>
              <div className="flex justify-between border-b border-black/50 pb-4">
                <span>Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-semibold pb-2">
                <span>Total:</span>
                <span>$1750</span>
              </div>
            </div>

            {/* Payment Options */}
            <div className="mt-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <input type="radio" name="payment" value="bank" id="bank" className="rounded-full accent-black h-4 w-4" defaultChecked/>
                  <label htmlFor="bank">Bank</label>
                  <div className="ml-auto flex gap-2">
                    <Image src="/placeholder.svg" alt="Klarna" width={32} height={20} />
                    <Image src="/placeholder.svg" alt="Visa" width={32} height={20} />
                    <Image src="/placeholder.svg" alt="Mastercard" width={32} height={20} />
                    <Image src="/placeholder.svg" alt="GPay" width={32} height={20} />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" name="payment" value="cash" id="cash" className="rounded-full accent-black h-4 w-4" />
                  <label htmlFor="cash">Cash on delivery</label>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mt-6">
              <input placeholder="Coupon Code" className="flex-1 px-3 py-2 border-black border rounded-md" />
              <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Apply Coupon</button>
            </div>

            {/* Place Order */}
            <button className="w-max mt-6 px-8 py-3 bg-red-500 text-white rounded-md hover:bg-red-600">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
