import { titleFont } from "@/config/fonts";
import React from "react";

interface Props {
  title: string;
  subtitle?: string;
}

const Title = ({ title, subtitle }: Props) => {
  return (
    <div className="mt-8 mb-6">
      <h1
        className={`${titleFont.className} antialiased text-3xl sm:text-4xl font-bold text-brand-green`}
      >
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-gray-600">{subtitle}</p>}
    </div>
  );
};

export default Title;
