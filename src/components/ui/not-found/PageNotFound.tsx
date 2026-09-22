import Image from "next/image";
import Link from "next/link";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Image
        src="/logo.png"
        alt=""
        width={512}
        height={512}
        className="opacity-80 h-[120px] w-auto"
      />
      <h1 className="mt-6 text-2xl font-bold">No encontramos lo que buscabas</h1>
      <p className="mt-1 text-gray-600">Puede que el producto ya no esté en la lista.</p>
      <Link href="/" className="btn-primary mt-6">
        Volver al catálogo
      </Link>
    </div>
  );
};

export default PageNotFound;
