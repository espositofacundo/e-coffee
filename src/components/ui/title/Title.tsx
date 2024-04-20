import { titleFont } from "@/config/fonts";
import React from "react";

interface Props {
  title: string;
  subtitle?: string;
}

const Title = ({ title, subtitle }: Props) => {
  return (
    <div className="">
      <h1
        className={`${titleFont.className} antialiased text-4xl font-semibold my-7 uppercase`}
      >
        {title}
      </h1>
      {subtitle && <h3 className="text-xl mb-10">{subtitle}</h3>}
    </div>
  );
};

export default Title;
