import { titleFont } from "@/config/fonts";
import { store } from "@/config/store";
import Image from "next/image";
import { BsWhatsapp } from "react-icons/bs";
import { MdOutlineLocalShipping } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-brand-green text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt={store.name}
            width={512}
            height={512}
            className="h-16 w-auto"
          />
          <div>
            <p className={`${titleFont.className} text-xl font-bold`}>
              {store.name}
            </p>
            <p className="text-sm text-white/80">{store.tagline}</p>
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Hacé tu pedido</p>
          <ul className="space-y-2">
            {store.contacts.map((contact) => (
              <li key={contact.whatsapp}>
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:underline"
                >
                  <BsWhatsapp />
                  <span className="font-semibold">{contact.name}:</span>
                  {contact.phone}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-start gap-2">
          <MdOutlineLocalShipping size={24} className="shrink-0" />
          <div>
            <p className="font-semibold">Envíos a domicilio</p>
            <p className="text-sm text-white/80">El envío es gratis en todos los pedidos.</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/15 py-4 text-center text-xs text-white/70">
        © {new Date().getFullYear()} {store.name}
      </div>
    </footer>
  );
}
