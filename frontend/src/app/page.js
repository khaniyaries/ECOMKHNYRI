import Image from "next/image";
import Navbar from "@/components/Navbar.jsx";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <div className="h-20"> 
        <Navbar />
      </div>
    </div>
  );
}
