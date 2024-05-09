import React from "react";
import Image from "next/image";
interface Props {
    src?:string;
    alt:string;
    className?:React.StyleHTMLAttributes<HTMLImageElement>['className'];
    style?:React.StyleHTMLAttributes<HTMLImageElement>['style'];
    width:number;
    height:number;
    
} 

const ProductImage = ({
src,alt,className,style,width,height
}:Props) => {

    const localSrc = (src) 
    ? src.startsWith('http')
    ? src
    : `/products/${src}`
    : '/imgs/placeholder.jpg'
  return (

    <Image
      src={localSrc}
      width={width}
      height={height}
      alt={alt}
      className={className}
      style={style}
    ></Image>
  );
};

export default ProductImage;
