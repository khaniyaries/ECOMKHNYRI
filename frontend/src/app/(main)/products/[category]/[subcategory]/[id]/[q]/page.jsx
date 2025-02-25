"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useState, useEffect } from "react";
import { env } from '../../../../../../../../config/config.js'
import { randomInt } from "crypto";
import toast from "react-hot-toast";
import { useRouter } from "next/router.js";





export default function CheckoutPage() {

  const [product, setproduct] = useState(null);
  const [firstname, setfirstname] = useState(null);
  const [companyname, setcompanyname] = useState('');
  const [streetaddress, setstreetaddress] = useState(null);
  const [apartmentdetails, setapartmentdetails] = useState(null);
  const [city, setcity] = useState(null);
  const [phonenumber, setphonenumeber] = useState(null);
  const [checked, setsave] = useState(true);
  const [image, setimage] = useState();
  const [name, setname] = useState();
  const [price, setprice] = useState();
  const [quantity, setquantity] = useState(null);
  const [invalid, setinvalid] = useState(false);
  const [color, setcolor] = useState();
  const [size, setsize] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [totalamount, settotalamount] = useState(0);
  const [subtotal, setsubtotal] = useState(0);
  const [selectedaddress, setselectedaddress] = useState()
  const [newaddress, setnewaddress] = useState(false);
  const [shippingaddress, setshippingaddress] = useState([]);
  const [paymentmode, setpaymentmode] = useState("bank");
  const userid = localStorage.getItem("userId")
  const [selectedstate, setselectedstate] = useState(null);
  const [pincode, setpincode] = useState(null);
  const [isopen, setisopen] = useState(true)
  const [openIndex, setOpenIndex] = useState(0);
  const [orderdone, setorderdone] = useState(false)
  const [orderid, setorderid] = useState(0)
  const pathname = usePathname();


  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];



  const { category, subcategory, id, q } = useParams();
  const fetchaddress = async () => {
    try {
      const addresse = await fetch(`${env.API_URL}/api/v1/user/address/?userId=${userid}`)
      const addresses = await addresse.json();
      setshippingaddress(addresses)
      if (addresses.length === 0) return setnewaddress(true);
    } catch (error) {
      console.log(error)

    }

  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${env.API_URL}/api/v1/products/${id}`)
        const product = await response.json()

        const formattedurl = decodeURIComponent(q).replace(/,/g, " ");
        const p = formattedurl.split(" ")
        setproduct(product);
        setimage(product.images[0].url)
        setname(product.name);
        setprice(product.price);
        console.log(p)
        setcolor(p[2]);
        setsize(p[1]);
        setquantity(p[0]);
        settotalamount((prev) => (prev + (product.price * p[0])))
        fetchaddress();




      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {

        setIsLoading(false)
      }
    }

    fetchProduct();
  }, [id])
  useEffect(() => {
    if (shippingaddress.length > 0) {
      setselectedaddress(shippingaddress[0]._id);
    }
    setshippingaddress(shippingaddress)
  }, [shippingaddress]);



  // const orderData = {
  //   orderItems: {
  //     product: id,
  //     quantity: quantity,
  //     size: size,
  //     color: color,
  //     price: price,
  //     category: category,
  //     subcategory: subcategory
  //   },
  //   customer: userid,
  //   totalamount: totalamount,
  //   paymentMode: paymentmode,
  //   shippingaddress: sle



  // }



  const handlenewaddress = async (e) => {
    e.preventDefault();

    try {
      if (firstname === null || companyname === null || streetaddress === null || apartmentdetails === null || city === null || phonenumber === null || selectedstate === null || pincode === null) {
        return setinvalid(true)
      }
      setIsLoading(true)
      const response = await fetch(`${env.API_URL}/api/v1/user/address/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userid, name: firstname, fullName: companyname, phone: phonenumber, address: streetaddress, locality: apartmentdetails, city: city, state: selectedstate, pinCode: pincode })
      })
      fetchaddress();
      setnewaddress(false)
      setIsLoading(false)

    } catch (error) {
      console.log(error)

    } 
     
  



  }
  const handleorder = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const response = await fetch(`${env.API_URL}/api/v1/sales/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderItems: {
            product: id,
            quantity: quantity,
            size: size,
            color: color,
            price: price,
            category: category,
            subcategory: subcategory
          },
          customer: userid,
          totalAmount: totalamount,
          paymentMode: paymentmode,
          address: selectedaddress
        })
      })
      const data = await response.json();
      if (response.ok) {
        setorderid(data._id)
      }



      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }







    } catch (error) {
      console.log(error.message)

    } finally {
      setIsLoading(false)
      setorderdone(true)
      set


    }
  }
  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Toggle the dropdown
  };





  if (orderdone) {
    return (
      <div className=" mt-20 flex justify-center items-center  mx-auto">
        <div className="">
          Your Order was placed successfully
        </div>
        <div>
          your order id is {orderid}
        </div>

      </div>
    )
  }


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
    </div>
  }
  return (

    <div className="container mx-auto w-full h-full px-4 md:px-10 lg:px-40 py-20">
      {/* Breadcrumb */}
      {/* <nav className="flex items-center gap-2 text-[8px] md:text-sm text-muted-foreground mb-8 md:mb-16">
        <Link href="/user/account" className="text-black/50">Account /</Link>
        <Link href="/user/my-account" className="text-black/50">My Account /</Link>
        <Link href="/user/products" className="text-black/50">Product /</Link>
        <Link href="/user/cart" className="text-black/50">View Cart /</Link>
        <span className="text-black">Checkout</span>
      </nav> */}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Billing Details */}
        <div>
          <h2 className="lg:text-4xl text-2xl font-inter font-medium mb-6">Billing Details</h2>

          {(!newaddress) && <div> {shippingaddress.map((address, index) => (

            <div className="border min-h-8 bg-gray-100 rounded-md border-gray-400">

              <div key={index} className="flex items-center justify-between">
                {/* Left side: Radio button and label */}
                <div className="flex font-bold   items-center space-x-4">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedaddress === address._id}
                    value={index}
                    id="bank"
                    className="rounded-full accent-black h-4 w-4"
                    onChange={() => { toggleOpen(index); setselectedaddress(shippingaddress[index]._id) }}
                  />
                  <label htmlFor="addresses">{address.name}</label>
                </div>

                {/* Right side: Arrow (▼ / ▲) */}
                <div onClick={() => toggleOpen(index)} className="cursor-pointer ml-auto mr-2">{openIndex === index ? "▲" : "▼"}</div>
              </div>

              <div className={`transition-all duration-700 ease-in-out overflow-hidden ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}>
                <div className="px-10 py-2  text-gray-700">
                  <div>
                    {address.fullName}
                  </div>
                  <div>
                    {address.address}
                  </div>
                  <div>
                    {address.locality}
                  </div>
                  <div>
                    {address.city}
                  </div>
                  <div>
                    {address.pinCode}
                  </div>
                  <div>
                    {address.state}
                  </div>
                  <div>
                    {address.phone}
                  </div>
                </div>

              </div>
            </div>))}
            <button
              onClick={() => setnewaddress(true)}
              className="px-3 py-1 mt-4 bg-red-500 text-white rounded-md hover:bg-red-600">Add new Address</button>


          </div>
          }




          {newaddress && <form className="space-y-4 text-black/50" >
            <div>
              <label htmlFor="firstName" className="block mb-2">First Name <span className="text-red-500">*</span></label>
              <input onChange={(e) => setfirstname(e.target.value)} id="firstName" required className="w-[90%] md:w-full bg-black/5 px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label htmlFor="companyName" className="block mb-2">Company Name</label>
              <input onChange={(e) => setcompanyname(e.target.value)} id="companyName" className="w-[90%] md:w-full px-3 py-2 bg-black/5 border rounded-md" />
            </div>
            <div>
              <label htmlFor="streetAddress" className="block mb-2">Street Address<span className="text-red-500">*</span></label>
              <input id="streetAddress" onChange={(e) => setstreetaddress(e.target.value)} required className="w-[90%] md:w-full bg-black/5 px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label htmlFor="apartment" className="block mb-2">Apartment, floor, etc. (optional)</label>
              <input id="apartment" onChange={(e) => setapartmentdetails(e.target.value)} className="w-[90%] md:w-full px-3 py-2 bg-black/5 border rounded-md" />
            </div>
            <div>
              <label htmlFor="townCity" className="block mb-2">Town/City<span className="text-red-500">*</span></label>
              <input id="townCity" onChange={(e) => setcity(e.target.value)} required className="w-[90%] md:w-full px-3 py-2 bg-black/5 border rounded-md" />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2">Phone Number<span className="text-red-500">*</span></label>
              <input minLength={6} required id="phone" onChange={(e) => setphonenumeber(e.target.value)} maxLength={10} type="tel" className="w-[90%] md:w-full px-3 py-2 bg-black/5 border rounded-md" />
            </div>
            <div>

              <label>Select a State:</label>
              <select value={selectedstate} onChange={(e) => setselectedstate(e.target.value)}>
                <option value="">-- Choose a State --</option>
                {indianStates.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <span className="text-red-500">*</span>
            </div>
            <div>
              <label htmlFor="pincode" className="block mb-2">pincode<span className="text-red-500">*</span></label>
              <input
                onChange={(e) => setpincode(e.target.value)}
                minLength={6}
                id="pincode" placeholder="Enter 6-Digit Pincode" type="text" maxLength={6} required className="w-[90%] md:w-full px-3 py-2 bg-black/5 border rounded-md" />
            </div>
            <div className="flex items-center space-x-2">
              <input
                checked={checked}
                onChange={(e) => { setsave(e.target.checked); }}

                type="checkbox" id="saveInfo" className="rounded border-gray-300 h-4 accent-red-500 w-4" />
              <label htmlFor="saveInfo" className="text-black text-sm md:text-base">Save this information for faster check-out next time</label>
            </div>
            <div className="mt-3 flex justify-end gap-7">
              <button
                onClick={() => setnewaddress(false)}
                className="px-3 py-1 mt-4 bg-transparent text-gray-800 rounded-md border  border-gray-300 hover:bg-gray-400">Cancel</button>
              <button
                onClick={handlenewaddress}
                className="px-3 py-1 mt-4 bg-red-500 text-white rounded-md hover:bg-red-600">submit</button>
            </div>
            {invalid && (
              <div>
                <span className="text-red-500 text-sm ">Please Fill Out Necessary Fields</span>
              </div>
            )}
          </form>}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 p-6 rounded-lg">
            {/* Products */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Image
                    src={image}
                    alt="LCD Monitor"
                    width={48}
                    height={48}
                    className="rounded-md"
                  />
                  <span>{name}</span>
                </div>
                <span>₹{price}</span>
              </div>
              <div style={{ margin: 0 }} className="flex justify-end gap-10 font-thin text-gray-500">
                <span>{size}</span>
                <span>{color}</span>
                <span>×{quantity}</span>
              </div>



              {/* <div className="flex items-center justify-between">
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
              </div> */}
            </div>

            {/* Totals */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between border-b border-black/50 pb-4">
                <span>Subtotal:</span>
                <span>₹{quantity * price}</span>
              </div>
              <div className="flex justify-between border-b border-black/50 pb-4">
                <span>Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-semibold pb-2">
                <span>Total:</span>
                <span>₹{totalamount}</span>
              </div>
            </div>

            {/* Payment Options */}
            <div className="mt-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    onClick={() => setpaymentmode("bank")}
                    checked={paymentmode === "bank"} type="radio" name="payment" value="bank" id="bank" className="rounded-full accent-black h-4 w-4" />
                  <label htmlFor="bank">Bank</label>
                  <div className="ml-auto flex gap-2">
                    <Image src="/placeholder.svg" alt="Klarna" width={32} height={20} />
                    <Image src="/placeholder.svg" alt="Visa" width={32} height={20} />
                    <Image src="/placeholder.svg" alt="Mastercard" width={32} height={20} />
                    <Image src="/placeholder.svg" alt="GPay" width={32} height={20} />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    checked={paymentmode === "cash"}
                    onClick={() => setpaymentmode("cash")}
                    type="radio" name="payment" value="cash" id="cash" className="rounded-full accent-black h-4 w-4" />
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
            <button
              onClick={handleorder}
              className="w-max mt-6 px-8 py-3 bg-red-500 text-white rounded-md hover:bg-red-600">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div >
  )
}
