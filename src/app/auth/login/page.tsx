
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage () {
  return (
    <div className="flex flex-col min-h-screen pt-20 sm:pt-30">

<h1 className="text-4xl mb-10">Nueva cuenta</h1>
      <div className="flex flex-col">
      <button
          
          className="btn-secondary py-4 flex justify-center items-center">
            <FcGoogle />
         <span className='pl-2'>Login con Gmail</span> 
        </button>

      <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-500"></div>
          <div className="px-2 text-gray-800">O</div>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>

        <label htmlFor="email">Correo electrónico</label>
        <input
          className="px-5 py-2 border bg-blue-200 rounded mb-5"
          type="email" />


        <label htmlFor="email">Contraseña</label>
        <input
          className="px-5 py-2 border bg-blue-200 rounded mb-5"
          type="email" />

        <button
          
          className="btn-primary">
          Ingresar
        </button>


        {/* divisor l ine */ }
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-500"></div>
          <div className="px-2 text-gray-800">O</div>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>

        <Link
          href="/auth/new-account" 
          className="btn-secondary text-center ">
          Crear una nueva cuenta
        </Link>

        <div className="flex items-center py-10">
          <div className="flex-1 border-t w-full border-gray-500"></div>
         
        </div>


      </div>
    </div>
  );
}
