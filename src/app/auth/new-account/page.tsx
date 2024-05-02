import Registerform from "./ui/Registerform";

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen pt-20 sm:pt-30">
      <h1 className="text-4xl mb-10">Nueva cuenta</h1>
      <Registerform/>
    </div>
  );
}
