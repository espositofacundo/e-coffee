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
            height: '300px',
            "--swiper-navigation-color": "#fff",
          
          } as React.CSSProperties
        }
        spaceBetween={10}
        navigation={true}
        autoplay={{
          delay: 2500,
        }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
      >
        <SwiperSlide key="/imgs/backgroundimagne.jpg">
          <Image
            width={1024}
            height={800}
            src="/imgs/backgroundimagne.jpg"
            alt="bannerDelicias"
            className="rounded-lg object-contain"
            
            priority
  
    
          />
        </SwiperSlide>
        <SwiperSlide key="/imgs/banerdelicias.jpg">
          <Image
            width={1024}
            height={800}
            src="/imgs/banerdelicias.PNG"
            alt="bannerDelicias"
            className="rounded-lg object-contain"
            priority
          />
        </SwiperSlide>
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
        <SwiperSlide key="/imgs/backgroundimagne.jpg">
          <Image
            width={1024}
            height={800} 
            src="/imgs/backgroundimagne.jpg"
            alt="bannerDelicias"
            className="rounded-lg object-contain"
          />
        </SwiperSlide>
        <SwiperSlide key="/imgs/banerdelicias.jpg">
          <Image
            width={1024}
            height={800} 
            src="/imgs/banerdelicias.PNG"
            alt="bannerDelicias"
            className="rounded-lg object-contain"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default BanerSlideShowHome;
