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



const BanerSlideShowHome = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObjet>();
  return (
    <div className="">
      <Swiper
     
        style={
          {
            width: '100vw',
            height: 'auto',
            "--swiper-navigation-color": "#fff",
          
          } as React.CSSProperties
        }
        spaceBetween={10}
       
        autoplay={{
          delay: 5000,
        }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
      >
        <SwiperSlide key="/imgs/b9.jpg">
          <Image
            width={1024}
            height={800}
            src="/imgs/b9.jpg"
            alt="b9"
            className="object-contain"
            
            priority
  
    
          />
        </SwiperSlide>
        <SwiperSlide key="/imgs/b8.jpg">
          <Image
            width={1024}
            height={800}
            src="/imgs/b8.jpg"
            alt="b8"
            className="object-contain"
            priority
          />
        </SwiperSlide>
        <SwiperSlide key="/imgs/b7.jpg">
          <Image
            width={1024}
            height={800}
            src="/imgs/b7.jpg"
            alt="b7"
            className="object-contain"
            priority
          />
        </SwiperSlide>
        <SwiperSlide key="/imgs/b6.jpg">
          <Image
            width={1024}
            height={800}
            src="/imgs/b6.jpg"
            alt="b6"
            className="object-contain"
            priority
          />
        </SwiperSlide>
       
      </Swiper>
     
    </div>
  );
};

export default BanerSlideShowHome;
