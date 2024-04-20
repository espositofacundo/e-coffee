'use client';

import React, { useState } from 'react'
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';

interface Props{
    quantity:number;
}

const QuantitySelector = ({quantity}:Props) => {

    const[count,setCount] = useState(quantity);
    
    const onQuantityChanged =(value:number)=>{
        if(count + value < 1) return;
        setCount(count + value);

    }
  return (
    <div className='flex'>
      <button onClick={()=>onQuantityChanged(-1)}>
        <IoRemoveCircleOutline size={30} className='bg-red-200 rounded-full'/>
      </button>
      <span className='flex justify-center w-12 mx-3 px-5 bg-blue-200 text-center rounded-md pt-1'>{count}</span>
      <button onClick={()=>onQuantityChanged(+1)}>
        <IoAddCircleOutline size={30} className='bg-green-200 rounded-full'/>
      </button>
    </div>
  )
}

export default QuantitySelector
