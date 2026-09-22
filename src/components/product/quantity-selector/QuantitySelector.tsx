"use client";

import { IoAdd, IoRemove } from "react-icons/io5";

interface Props {
  quantity: number;
  onQuantityChange: (value: number) => void;
}

const QuantitySelector = ({ quantity, onQuantityChange }: Props) => {
  const onValueChanged = (value: number) => {
    if (quantity + value < 1) return;
    onQuantityChange(quantity + value);
  };

  return (
    <div className="inline-flex items-center rounded-lg border border-brand-cream-dark bg-white">
      <button
        type="button"
        onClick={() => onValueChanged(-1)}
        className="p-2 hover:bg-brand-cream-dark rounded-l-lg disabled:opacity-40"
        disabled={quantity <= 1}
        aria-label="Restar uno"
      >
        <IoRemove size={18} />
      </button>
      <span className="w-10 text-center font-semibold">{quantity}</span>
      <button
        type="button"
        onClick={() => onValueChanged(+1)}
        className="p-2 hover:bg-brand-cream-dark rounded-r-lg"
        aria-label="Sumar uno"
      >
        <IoAdd size={18} />
      </button>
    </div>
  );
};

export default QuantitySelector;
