"use client";
import React, { useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperObjet } from "swiper";

// Import Swiper styles

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import "./slideshow.css";
import { Autoplay, FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";

interface Props {
  images: string[];
  title: string;
  className?: string;
}

const ProductSlideshow = ({ images, title, className }: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObjet>();
  return (
    <div className={className}>
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        } as React.CSSProperties
    }
        spaceBetween={10}
        navigation={true}
        autoplay={{
            delay:2500
        }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs,Autoplay]}
        className="mySwiper2"
      >
        {
            images.map(images=>(

                <SwiperSlide key={images}>
                    <Image width={1024} height={800} src={`/products/${images}`} alt={title} className="rounded-lg object-fill"/>
        
                </SwiperSlide>

            ))
        }
       
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
         {
            images.map(images=>(

                <SwiperSlide key={images}>
                    <Image width={300} height={300} src={`/products/${images}`} alt={title} className="rounded-lg object-fill"/>
        
                </SwiperSlide>

            ))
        }
      </Swiper>
    </div>
  );
};

export default ProductSlideshow;
