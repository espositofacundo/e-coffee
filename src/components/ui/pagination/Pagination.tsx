"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

import { MdOutlineFirstPage, MdOutlineLastPage } from "react-icons/md";

interface Props {
  totalPages: number;
}

const Pagination = ({ totalPages }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) ?? 1;

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    
    if (+pageNumber < 1) {
      return `${pathname}`;
    }
    if (+pageNumber > totalPages) {
      return `${pathname}?${params.toString()}`;
    }
   

    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div>
      <div className="flex text-center justify-center pb-10">
        <nav aria-label="Page navigation example">
          <ul className="flex list-style-none">

          <li className="page-item">
              <Link
                className="page-link relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-blue-600 focus:shadow-none"
                href={createPageUrl(1)}
              >
                <div className="flex justify-center items-center ">
                  
                  <span className="pr-1"> Page: 1 </span>
                  <MdOutlineFirstPage size={30} />
                </div>
                
              </Link>
            </li>
            <li className="page-item">
              <Link
                className="page-link relative block py-1.5   border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-blue-600 focus:shadow-none"
                href={createPageUrl(currentPage - 1)}
                aria-disabled="true"
              >
                <IoChevronBackOutline size={30} />
              </Link>
            </li>
            
            <li className="page-item active px-6">
              <span
                className="page-link relative block py-1.5 px-3  border-0 bg-blue-400 outline-none transition-all duration-300 rounded text-white hover:text-white hover:bg-blue-600 shadow-md focus:shadow-md"
               
              >
                
                
                 <span className="visually-hidden">{currentPage}</span>
              </span>
            </li>
            
            <li className="page-item">
              <Link
                className="page-link relative block py-1.5  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-blue-600 focus:shadow-none"
                href={createPageUrl(currentPage + 1)}
              >
                <IoChevronForwardOutline size={30} />
              </Link>
            </li>
            <li className="page-item">
              <Link
                className="page-link relative block py-1.5 px-3   border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-blue-600 focus:shadow-none"
                href={createPageUrl(totalPages)}
              >
                <div className="flex justify-center items-center ">
                  <MdOutlineLastPage size={30} /> 
                  <span className="pl-1"> Page: {totalPages} </span>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
