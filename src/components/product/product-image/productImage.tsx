import React from "react";
import Image from "next/image";
import clsx from "clsx";

interface Props {
  src?: string;
  alt: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>["className"];
  style?: React.StyleHTMLAttributes<HTMLImageElement>["style"];
  width: number;
  height: number;
  priority?: boolean;
}

const ProductImage = ({
  src,
  alt,
  className,
  style,
  width,
  height,
  priority = false,
}: Props) => {
  // Sin foto se muestra el logo sobre fondo crema, con la misma proporción.
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={clsx(
          className,
          "flex items-center justify-center overflow-hidden bg-brand-cream-dark"
        )}
        style={{ aspectRatio: `${width} / ${height}`, ...style }}
      >
        <Image
          src="/logo.png"
          alt=""
          width={300}
          height={234}
          className="w-3/4 h-auto opacity-90"
          priority={priority}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={alt}
      className={className}
      style={style}
      priority={priority}
    />
  );
};

export default ProductImage;
