import Image from "next/image";
const ServiceBenefitsFooter = () => {
    return(
        <div className="w-full px-28 md:px-20 lg:px-40 py-10 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                <div className="flex flex-col h-[230px] justify-center items-center gap-1 p-4 bg-white rounded-md">
                    <div className="rounded-full bg-gray-300 mb-2 h-max w-max p-2 z-10">
                        <div className="rounded-full bg-black h-max w-max p-1 z-20">
                            <Image
                            src="/images/ServicesBenefits/icon-delivery.png"
                            alt="Active Sellers"
                            height={40}
                            width={40}
                            className="mx-auto invert-0"
                            sizes="(max-width: 768px) 96px, 96px"
                            loading="lazy"
                            />
                        </div>
                    </div>
                    <h3 className="text-center text-xl font-poppins font-semibold text-black ">
                        FREE AND FAST DELIVERY
                    </h3>
                    <h4 className="text-center font-poppins font-normal text-base text-black">
                        Free delivery for all orders over $140
                    </h4>
                </div>
                <div className="flex flex-col h-[230px] justify-center items-center gap-1 p-4 bg-white border-gray-300 rounded-md">
                    <div className="rounded-full bg-gray-300 mb-2 h-max w-max p-2 z-10">
                        <div className="rounded-full bg-black h-max w-max p-1 z-20">
                            <Image
                            src="/images/ServicesBenefits/icon-customer-service.png"
                            alt="Monthly Sales"
                            height={40}
                            width={40}
                            className="mx-auto invert-0"
                            sizes="(max-width: 768px) 96px, 96px"
                            loading="lazy"
                            />
                        </div>
                    </div>
                    <h3 className="text-center text-xl font-poppins font-semibold text-black">
                        24/7 CUSTOMER SERVICE
                    </h3>
                    <h4 className="text-center font-poppins font-normal text-base text-black">
                        Friendly 24/7 customer support
                    </h4>
                </div>
                <div className="flex flex-col h-[230px] justify-center items-center gap-1 p-4 bg-white rounded-md ">
                    <div className="rounded-full bg-gray-300 mb-2 h-max w-max p-2 z-10 ">
                        <div className="rounded-full bg-black h-max w-max p-1 z-20 ">
                            <Image
                            src="/images/ServicesBenefits/icon-security.png"
                            alt="Active Customers"
                            height={40}
                            width={40}
                            className="mx-auto invert-0"
                            sizes="(max-width: 768px) 96px, 96px"
                            loading="lazy"
                            />
                        </div>
                    </div>
                    <h3 className="text-center text-xl font-poppins font-semibold text-black">
                        MONEY BACK GUARANTEE
                    </h3>
                    <h4 className="text-center font-poppins font-normal text-base text-black">
                        We reurn money within 30 days
                    </h4>
                </div>
            </div>
        </div>
    )
}

export default ServiceBenefitsFooter;