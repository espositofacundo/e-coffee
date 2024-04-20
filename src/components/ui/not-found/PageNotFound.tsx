import Image from "next/image";
import Link from "next/link";
import React from "react";

const PageNotFound = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row h-[800px] w-full justify-center items-center align-middle">
      <div className="text-center">
      <Link href="/" className="text-blue-800 text-2xl font-bold">Regresar</Link>
        <h1 className="text-4xl">Error 404 not found</h1>
        
      </div>

      <div>
        <Image src="/imgs/starman_750x750.png" alt="startman" className="p-5 sm:p-0" width={550} height={550}/>
      </div>
    
    </div>
  );
};

export default PageNotFound;
