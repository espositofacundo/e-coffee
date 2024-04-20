import React from "react";
import { ValidSizes } from "@/interfaces";
import clsx from "clsx";

interface Props {
  selectedSize: ValidSizes;
  availableSizes: ValidSizes[];
}

const SizeSelector = ({ selectedSize, availableSizes }: Props) => {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-4">Tamaño</h3>
      <div className="flex">
        {availableSizes.map((size) => (
          <button
            key={size}
            className={clsx("mx-2 hover:underline text-lg", {
              underline: size === selectedSize,
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
