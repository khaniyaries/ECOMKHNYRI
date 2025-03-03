"use client"
import { HiOutlineArrowSmLeft, HiOutlineArrowSmRight } from "react-icons/hi";
import { env } from "../../../../config/config.js";

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { fetchProducts } from '@/utils/productapi.js';
import axios from 'axios';
import Image from 'next/image';
import { uploadToCloudinary } from 'config/cloudinary';
import Link from "next/link";
import toast from "react-hot-toast";

export default function Banners() {
  const [isLoading, setIsLoading] = useState(false);
  const [url, seturl] = useState()
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [src, setsrc] = useState()
  const [title, setitle] = useState("")
  const [link, setlink] = useState("")
  const [order, setorder] = useState(Number)
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    productId: '',
    order: 0,
    isActive: true
  });
  const [file, setnewfile] = useState()


  useEffect(() => {
    if (file)
      setsrc(URL.createObjectURL(file))

  }, [file])

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${env.API_URL}/api/v1/banners`);
      console.log(response)
      if (response.ok) {
        const data = await response.json()
        console.log(data.banners)
        setBanners(data.banners)
      }
      // Destructure only what you're using
      // const [productsRes] = await Promise.all([
      //fetchProducts()
      // ]);
      // // setBanners(bannersRes.data); // Commented out since bannersRes isn't defined
      // setProducts(productsRes.data || []); // Add fallback empty array
    } catch (error) {
      console.error('Error fetching data:', error);
      setBanners([]); // Set empty array on error
    }
  };
  // const handleimageupload = (e) => {
  //   setnewfile(e.target.file)
  //   console.log(file)

  // }

  const handleNewBannerChange = (e) => {
    setNewBanner({
      ...newBanner,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    });
  };

  const handleBannerChange = (bannerId, field, value) => {
    setBanners(banners.map(banner =>
      banner._id === bannerId ? { ...banner, [field]: value } : banner
    ));
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    // await axios.post('/api/admin/banner', newBanner);
    // setNewBanner({
    //   title: '',
    //   subtitle: '',
    //   productId: '',
    //   order: 0,
    //   isActive: true
    // });
    try{
    const image = await uploadToCloudinary(file)
    const response = await fetch(`${env.API_URL}/api/v1/banners`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({url:image,index:order,linktitle:title,link:link})
    });
    if(response.ok){
      toast.success("banner  updated successfully")
    }
    fetchData();}
    catch(error){
      console.log(error)
    }
  };

  const handleUpdateBanner = async (banner) => {
    await axios.put('/api/admin/banner', banner);
    fetchData();
  };

  const handleDeleteBanner = async (bannerId) => {
    await axios.delete('/api/admin/banner', { data: { id: bannerId } });
    fetchData();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      {/* Existing Banners */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Current Banners</h2>
        {banners.map((banner) => (
          <div key={banner.index} className="max-h-[35vh] h-fit  md:h-[40vh] z-5 md:w-[84%]  border border-gray-900  flex flex-col  gap-3  relative">
            <div className="w-full h-fit md:h-full relative">
              <div className="relative h-fit md:h-full  flex-col flex  w-full">

                <img
                  src={banner.url}
                  alt="banner"
                  loading="lazy"
                  className="object-cover z-50 relative h-fit md:h-full"
                />


              </div>

            </div>
            <Link href={banner.link}>
              <div style={{ zIndex: "100" }} className='flex m-0  absolute text-wrap bottom-0 w-full bg-black md:py-1 rounded-t-md text-white font-bold md'>
                <div className='w-[50%] ml-3'>
                  {banner.linktitle}
                </div>
                <div className=" flex w-full m-0 mr-2  justify-end">
                  <HiOutlineArrowSmRight className="w-6 h-6" />
                </div>
              </div>
            </Link>
            {/* <div className="relative top-4   transform flex   justify-center gap-2">
              {[0, 1, 2, 3, 4].map((index) => (
                <button
                  key={index}
                  className={`w-1 md:w-2 md:h-2 h-2 rounded-full transition-all duration-300  "bg-red-500 border md:border-2 border-white outline md:outline-2 outline-gray-400"
                    `}
                  onClick={() => handleDotClick(index)}
                ></button>
              ))}
            </div> */}
          </div>

        ))}
        {/* {banners.map((banner) => (
          <div key={banner._id} className="border p-4 rounded">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Title</label>
                <input
                  value={banner.title}
                  onChange={(e) => handleBannerChange(banner._id, 'title', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-2">Subtitle</label>
                <input
                  value={banner.subtitle}
                  onChange={(e) => handleBannerChange(banner._id, 'subtitle', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Product</label>
                <select
                  value={banner.productId._id}
                  onChange={(e) => handleBannerChange(banner._id, 'productId', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Order</label>
                <input
                  type="number"
                  value={banner.order}
                  onChange={(e) => handleBannerChange(banner._id, 'order', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={banner.isActive}
                    onChange={(e) => handleBannerChange(banner._id, 'isActive', e.target.checked)}
                  />
                  Active
                </label>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleUpdateBanner(banner)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteBanner(banner._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))} */}
      </div>

      {/* New Banner Form */}
      <div className="border p-4 rounded w-full ">
        <h2 className="text-xl font-bold mb-4">Update Banner</h2>
        <h2 className="text-xl font-bold mb-4">Preview:</h2>
        <div className="max-h-[40vh] h-fit  md:h-[40vh] z-5 md:w-[84%]  border border-gray-900  flex flex-col justify-center gap-3  relative">
          {/* <div className="w-full h-[50%] md:w-[50%] md:h-full flex flex-col gap-5 md:gap-10 items-start"> */}
          {/* <div className="flex flex-row items-center justify-center gap-2">
              <FaApple color="white" className="h-10 w-10" />
              <h2 className="text-base text-white font-normal font-poppins">
                iPhone 14 Series
              </h2>
            </div> */}
          {/* <h1 className="lg:text-4xl md:3xl text-white font-semibold font-inter">
              Up to 10% <br /> off Voucher
            </h1>
            <Link
              href="/products"
              className="text-white text-base font-medium font-poppins underline flex items-center gap-2 justify-center"
            >
              Shop Now! <span className="no-underline"><BsArrowRight /></span>
            </Link> */}
          {/* </div> */}
          <div className="w-full h-fit md:h-full relative">
            <div className="relative h-fit md:h-full  flex-col flex justify-center w-full">
              {/* <Image
                src="/images/banner.png"
                alt="Product Picture"
                fill
                className=" h-fit object-contain z-50 relative"
              /> */}
              <img
                src={src}
                alt="Product Picture"
                loading="lazy"
                className="object-contain z-50 relative h-fit md:h-full"
              />


            </div>

          </div>
          <Link href={link}>
            <div style={{ zIndex: "100" }} className='flex m-0  absolute text-wrap bottom-0 w-full bg-black md:py-1 rounded-t-md text-white font-bold md'>
              <div className='w-[50%] ml-3'>
                {title}
              </div>
              <div className=" flex w-full m-0 mr-2  justify-end">
                <HiOutlineArrowSmRight className="w-6 h-6" />
              </div>
            </div>
          </Link>
          <div className="relative top-4   transform flex   justify-center gap-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <button
                key={index}
                className={`w-1 md:w-2 md:h-2 h-2 rounded-full transition-all duration-300  "bg-red-500 border md:border-2 border-white outline md:outline-2 outline-gray-400"
                    `}
                onClick={() => handleDotClick(index)}
              ></button>
            ))}
          </div>
        </div>


        <form onSubmit={handleCreateBanner} className="grid grid-cols-2 mt-4  gap-4">
          <div>
            <label className="block mb-2">Link Title</label>
            <input
              name="title"
              onChange={(e) => { setitle(e.target.value); }}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Link</label>
            <input
              name="subtitle"
              onChange={(e) => setlink(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          {/*
          <div> */}
          {/* <label className="block mb-2">Product</label>
            <select
              name="productId"
              value={newBanner.productId}
              onChange={handleNewBannerChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>*/}

          <div>
            <label className="block mb-2">Order</label>
            <input
              type="number"
              name="order"
              onChange={(e) => setorder(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* <div className="flex items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={newBanner.isActive}
                onChange={handleNewBannerChange}
              />
              Active
            </label>
          </div> */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setnewfile(e.target.files[0])
                  if (file)
                    setsrc(URL.createObjectURL(file))
                }


              }}
              className="block text-wrap w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>


          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Create Banner
          </button>
        </form>
      </div>
    </div>
  );
}
