import { maxHeaderSize } from "http";
import Image from "next/image";

import React from "react";

const BannerDelicias = () => {
  return (
    <>
    <Image
  src="/imgs/banerdelicias.PNG"
  alt="bannerDelicias"
  className="p-0 sm:p-0 overflow-hidden h-40 md:h-auto"
  width={maxHeaderSize}
  height={100} // Establece una altura fija de 40 píxeles
/>
    </>
    
        
    
  );
};

export default BannerDelicias;