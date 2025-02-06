import Image from "next/image";
const About = () => {
    return (
        <div className="w-full h-full relative">
            <div className="md:pl-40 md:py-20 px-5">
                <h1 className="text-sm text-slate-600">Home / <span className="text-black">About</span></h1>
                
                <div className="flex items-center"> {/* Added items-center for vertical alignment */}
                    <section className="max-w-[50%] pr-20">
                        <h1 className="text-4xl font-bold mb-6">Our Story</h1>
                        <p className="mb-4">
                            Launced in 2015, Exclusive is South Asia's premier online shopping makterplace with an active presense in Bangladesh. 
                            Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sallers and 300 brands 
                            and serves 3 millioons customers across the region. 
                        </p>
                        <p>
                            Exclusive has more than 1 Million products to offer, growing at a very fast. 
                            Exclusive offers a diverse assotment in categories ranging from consumer.
                        </p>
                    </section>
                    
                    <div className="flex-1">
                        <Image
                            src="/images/side-image.png"
                            alt="Side Image"
                            height={609}
                            width={705}
                            className="object-cover w-full h-full"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
            <div className="w-full md:px-40 md:py-20 flex flex-row gap-20 justify-center">
                    <div className="flex flex-col w-[270px] h-[230px] justify-center gap-4 p-4 bg-white border-[2px] border-gray-300 hover:border-red-500 rounded-md transition-transform duration-300 hover:bg-red-500">
                        <div>
                            <Image
                            src="/images/hello.png"
                            alt="Hello"
                            height={56}
                            width={56}
                            className="mx-auto group-hover:brightness-0 group-hover:invert"
                            sizes="(max-width: 768px) 96px, 96px"
                            loading="lazy"
                            />
                        </div>
                        <h3 className="text-center text-black font-medium group-hover:text-white">
                            Heyu
                        </h3>
                    </div>
                    <div className="flex flex-col w-[270px] h-[230px] justify-center gap-4 p-4 bg-white border-[2px] border-gray-300 hover:border-red-500 rounded-md transition-transform duration-300 hover:bg-red-500">
                        <div>
                            <Image
                            src="/images/hello.png"
                            alt="Hello"
                            height={56}
                            width={56}
                            className="mx-auto group-hover:brightness-0 group-hover:invert"
                            sizes="(max-width: 768px) 96px, 96px"
                            loading="lazy"
                            />
                        </div>
                        <h3 className="text-center text-black font-medium group-hover:text-white">
                            Heyu
                        </h3>
                    </div>
                    <div className="flex flex-col w-[270px] h-[230px] justify-center gap-4 p-4 bg-white border-[2px] border-gray-300 hover:border-red-500 rounded-md transition-transform duration-300 hover:bg-red-500">
                        <div>
                            <Image
                            src="/images/hello.png"
                            alt="Hello"
                            height={56}
                            width={56}
                            className="mx-auto group-hover:brightness-0 group-hover:invert"
                            sizes="(max-width: 768px) 96px, 96px"
                            loading="lazy"
                            />
                        </div>
                        <h3 className="text-center text-black font-medium group-hover:text-white">
                            Heyu
                        </h3>
                    </div>
                    <div className="flex flex-col w-[270px] h-[230px] justify-center gap-4 p-4 bg-white border-[2px] border-gray-300 hover:border-red-500 rounded-md transition-transform duration-300 hover:bg-red-500">
                        <div>
                            <Image
                            src="/images/hello.png"
                            alt="Hello"
                            height={56}
                            width={56}
                            className="mx-auto group-hover:brightness-0 group-hover:invert"
                            sizes="(max-width: 768px) 96px, 96px"
                            loading="lazy"
                            />
                        </div>
                        <h3 className="text-center text-black font-medium group-hover:text-white">
                            Heyu
                        </h3>
                    </div>
                </div>
        </div>
    )
}

export default About;