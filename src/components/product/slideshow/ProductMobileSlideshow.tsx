"use client";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";


import "./slideshow.css";
import { Autoplay, FreeMode, Navigation } from "swiper/modules";
import Image from "next/image";

interface Props {
  images: string[];
  title: string;
  className?: string;
}

const ProductMobileSlideshow = ({ images, title, className }: Props) => {
  return (
    <div className={className}>
      <Swiper
      style={{
        width: '100vw',
        
      }
      }
        navigation={true}
        autoplay={{
          delay: 2500,
        }}
        modules={[FreeMode, Autoplay, Navigation]}
        className="mySwiper2"
      >
        {images.map((images) => (
          <SwiperSlide key={images}>
            <Image
              width={600}
              height={500}
              src={`/products/${images}`}
              alt={title}
              className="object-fill"
              priority
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductMobileSlideshow;
