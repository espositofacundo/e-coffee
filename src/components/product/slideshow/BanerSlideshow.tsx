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
        <SwiperSlide key="/imgs/b1.jpg">
          <Image
            width={1024}
            height={800}
            src="/imgs/b1.jpg"
            alt="b1"
            className="object-contain"
            
            priority
  
    
          />
        </SwiperSlide>
        <SwiperSlide key="/imgs/b2.jpg">
          <Image
            width={1024}
            height={800}
            src="/imgs/b2.jpg"
            alt="b2"
            className="object-contain"
            priority
          />
        </SwiperSlide>
        <SwiperSlide key="/imgs/b3.jpg">
          <Image
            width={1024}
            height={800}
            src="/imgs/b3.jpg"
            alt="b3"
            className="object-contain"
            priority
          />
        </SwiperSlide>
        <SwiperSlide key="/imgs/b4.jpg">
          <Image
            width={1024}
            height={800}
            src="/imgs/b4.jpg"
            alt="b4"
            className="object-contain"
            priority
          />
        </SwiperSlide>
        <SwiperSlide key="/imgs/b5.jpg">
          <Image
            width={1024}
            height={800}
            src="/imgs/b5.jpg"
            alt="b5"
            className="object-contain"
            priority
          />
        </SwiperSlide>
      </Swiper>
     
    </div>
  );
};

export default BanerSlideShowHome;
