"use client"
export default function ContactPage() {

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission
    }

    return (
      <div className="w-full h-full mx-auto px-4 md:px-20 lg:px-40 py-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-12">
          <a href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Contact</span>
        </nav>
  
        {/* Main content grid */}
        <div className="grid md:grid-cols-[350px,1fr] gap-12">
          {/* Left column - Contact Info */}
          <div className="space-y-8 md:shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] md:py-6 md:px-8 h-auto">
            {/* Call To Us Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-red-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h2 className="text-base font-poppins font-medium">Call To Us</h2>
              </div>
              <p className="text-black font-poppins font-normal mb-4">We are available 24/7, 7 days a week.</p>
              <p className="text-black font-poppins font-normal mb-4">Phone: +18061112222</p>
            </div>

            <hr className="border-black"/>
  
            {/* Write To Us Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-red-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-base font-poppins font-medium">Write To Us</h2>
              </div>
              <p className="text-black font-poppins font-normal mb-4">Fill out our form and we will contact you within 24 hours.</p>
              <div className="space-y-2">
                <p className="text-black font-poppins font-normal mb-4">Email: customer@exclusive.com</p>
                <p className="text-black font-poppins font-normal mb-4">Email: support@exclusive.com</p>
              </div>
            </div>
          </div>
  
          {/* Right column - Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6 md:shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] md:py-6 md:px-14">
            {/* Input fields row */}
            <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4">
                <div className="relative">
                    <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-md bg-black/5 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 placeholder:text-black/50"
                    required
                />
                <span className="absolute text-red-500 top-3 left-[100px]">*</span>
                </div>
                <div className="relative">
                    <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-md bg-black/5 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 placeholder:text-black/50"
                    required
                    />
                    <span className="absolute text-red-500 top-3 left-[100px]">*</span>
                </div>
                <div className="relative">
                    <input
                    type="tel"
                    placeholder="Your Phone"
                    className="w-full px-4 py-3 rounded-md bg-black/5 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 placeholder:text-black/50"
                    required
                    />
                    <span className="absolute text-red-500 top-3 left-[100px]">*</span>
                </div>
            </div>
  
            {/* Message textarea */}
            <textarea
              placeholder="Your Message"
              rows={8}
              className="w-full px-4 py-3 rounded-md bg-black/5 border-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
            ></textarea>
  
            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    )
}
  
  