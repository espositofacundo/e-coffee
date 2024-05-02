'use client';

import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';

interface Props{
    quantity:number;
    onQuantityChange: (value:number)=> void;
}

const QuantitySelector = ({quantity,onQuantityChange}:Props) => {


    const onValueChanged =(value:number)=>{
        if(quantity + value < 1) return;
        onQuantityChange(quantity + value);

    }
  return (
    <div className='flex'>
      <button onClick={()=>onValueChanged(-1)}>
        <IoRemoveCircleOutline size={30} className='bg-red-200 rounded-full'/>
      </button>
      <span className='flex justify-center w-12 mx-3 px-5 bg-blue-200 text-center rounded-md pt-1'>{quantity}</span>
      <button onClick={()=>onValueChanged(+1)}>
        <IoAddCircleOutline size={30} className='bg-green-200 rounded-full'/>
      </button>
    </div>
  )
}

export default QuantitySelector
