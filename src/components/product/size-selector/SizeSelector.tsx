import React from "react";
import { Size } from '@/interfaces/product.interface';

import clsx from "clsx";


interface Props {
  selectedSize?: Size;
  availableSizes: Size[];
  onSizeChanged: (size: Size) => void;
}

const SizeSelector = ({ selectedSize, availableSizes,onSizeChanged }: Props) => {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-2">Tamaño:</h3>
      <div className="flex">
        {availableSizes.map((size) => (
          <button
            key={size}
            onClick={()=>onSizeChanged(size)}
            className={clsx("mx-2  hover:underline ", {
              underline: size === selectedSize,
              'text-blue-500 font-bold': size === selectedSize
              
            })}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
