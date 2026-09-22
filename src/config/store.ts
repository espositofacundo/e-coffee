export const store = {
  name: "Timón & Pumba",
  tagline: "Snacks ricos, naturales y para todos los días",
  description:
    "Distribuidora de frutos secos, mix, semillas, granolas, harinas y más. Envíos a domicilio.",
  contacts: [
    { name: "Tomás", phone: "223 686-6310", whatsapp: "5492236866310" },
    { name: "Valentina", phone: "223 513-9465", whatsapp: "5492235139465" },
  ],
};

export type StoreContact = (typeof store.contacts)[number];
