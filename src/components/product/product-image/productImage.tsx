import React from "react";
import Image from "next/image";

interface Props {
    src?: string;
    alt: string;
    className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
    style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
    width: number;
    height: number;
    priority?: boolean;  // Añadir esta línea
}

const ProductImage = ({
    src,
    alt,
    className,
    style,
    width,
    height,
    priority = false  // Añadir valor predeterminado
}: Props) => {
    const localSrc = src 
        ? src.startsWith('http') ? src : `/products/${src}`
        : '/imgs/placeholder.jpg';

    return (
        <Image
            src={localSrc}
            width={width}
            height={height}
            alt={alt}
            className={className}
            style={style}
            priority={priority}  // Utilizar la propiedad aquí
        />
    );
};

export default ProductImage;

