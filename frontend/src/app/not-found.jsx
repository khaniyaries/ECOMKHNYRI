import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="w-full h-full relative ">
        <div className="md:px-28 lg:px-40 md:py-20 py-24 px-10">
            <h1 className="text-sm text-slate-600">Home / <span className="text-black">404 Error</span></h1>
            <div className="flex flex-col md:mt-20 items-center gap-5 justify-center">
                <h1 className="md:text-4xl lg:text-8xl font-bold mt-8">404 Not Found</h1>
                <p className="text-gray-600 mt-4 text-center">
                    Your visited page not found. You may return to home page.
                </p>
                <Link href="/">
                    <button className="bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-600 transition-colors">
                        Back to Home Page
                    </button>
                </Link>
            </div>
        </div>
    </div>
  )
}