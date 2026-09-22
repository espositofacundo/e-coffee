import bcryptjs from "bcryptjs";

export interface SeedProduct {
  title: string;
  description?: string;
  unit?: "kg" | "unidad";
  priceHalf?: number;
  price: number;
  variants?: string[];
}

interface SeedCategory {
  name: string;
  products: SeedProduct[];
}

interface SeedUser {
  email: string;
  password: string;
  role: "admin" | "user";
}

interface SeedData {
  users: SeedUser[];
  categories: SeedCategory[];
}

// Lista de precios de Timón & Pumba (vigente hasta 27/09/2026).
export const initialData: SeedData = {
  users: [
    {
      email: "admin@timonypumba.com",
      password: bcryptjs.hashSync("123123"),
      role: "admin",
    },
    {
      email: "cliente@timonypumba.com",
      password: bcryptjs.hashSync("123123"),
      role: "user",
    },
  ],

  categories: [
    {
      name: "Frutos Secos",
      products: [
        { title: "Nuez Mariposa Extra Light", priceHalf: 9215, price: 17160 },
        { title: "Almendra Non Pareil", priceHalf: 14807, price: 27573 },
        { title: "Castañas de Cajú", priceHalf: 10335, price: 19244 },
        { title: "Pistachos Salados con Cáscara", priceHalf: 20361, price: 37913 },
        { title: "Banana Chips", priceHalf: 7095, price: 13211 },
        { title: "Dátiles con carozo", description: "De Argelia", priceHalf: 5244, price: 9765 },
        { title: "Pasa de Arándanos", priceHalf: 11954, price: 22258 },
        { title: "Pasa de Uva Jumbo", priceHalf: 3239, price: 6030 },
        { title: "Pasa de Uva Rubia", priceHalf: 5167, price: 9621 },
        { title: "Maní sin Sal", priceHalf: 1850, price: 3446 },
        { title: "Maní Salado", priceHalf: 1850, price: 3445 },
        { title: "Maní con Cáscara", price: 3590 },
        { title: "Maní Cervecero", priceHalf: 4425, price: 8240 },
      ],
    },
    {
      name: "Mix - Semillas",
      products: [
        { title: "Mix Seco", description: "Almendra, nuez, cajú y avellanas", priceHalf: 12439, price: 23162 },
        { title: "Mix Antioxidante", description: "Castañas, nuez, almendra, pasas, arándanos, frutilla, coco", priceHalf: 8852, price: 16482 },
        { title: "Mix Tropical", description: "Almendra, banana chips, pasas, nuez, maní, ananá", priceHalf: 5036, price: 9377 },
        { title: "Mix Europeo", description: "Nuez, almendra, castañas, pasa morocha y rubia", priceHalf: 6716, price: 12505 },
        { title: "Mix sin Pasas", description: "Nuez, almendra, castaña y maní", priceHalf: 7402, price: 13782 },
        { title: "Mix Premium", description: "Pasa rubia, nuez, pasa de uva, maní, almendra y cajú", priceHalf: 5799, price: 10799 },
        { title: "Mix Snack", description: "Maní salado, girasol, maíz frito, zapallo y almendras", priceHalf: 4120, price: 7672 },
        { title: "Mix Semillas", description: "Chía, lino, girasol y sésamo", priceHalf: 2274, price: 4235 },
        { title: "Semillas de sésamo integral", priceHalf: 1079, price: 2009 },
        { title: "Semillas de Zapallo", price: 19388 },
        { title: "Girasol Pelado", priceHalf: 2313, price: 4308 },
      ],
    },
    {
      name: "Harinas - Legumbres",
      products: [
        { title: "Harina de Almendras sin Piel", price: 3843 },
        { title: "Avena Instantánea", price: 1988 },
        { title: "Lenteja Nacional", price: 2355 },
        { title: "Garbanzo", price: 1975 },
        { title: "Poroto Alubia", price: 2296 },
        { title: "Arroz Doble Carolina", price: 2727 },
        { title: "Arroz Yamaní", price: 2296 },
      ],
    },
    {
      name: "Granolas - Cereales - Barras",
      products: [
        { title: "Granola “Integra” x 350 gr", unit: "unidad", price: 7633, variants: ["Sola", "Con chocolate"] },
        { title: "Granola “Nutrinola” Base", price: 8974 },
        { title: "Granola “Nutrinola” Tradicional", price: 11361 },
        { title: "Granola “Nutrinola” Cocada", price: 10314 },
        { title: "Granola “Nutrinola” Energizante", price: 12967 },
        { title: "Barras de granola “Integra”", unit: "unidad", price: 13644, variants: ["Cajú y arándanos", "Banana y nuez", "Chocolate", "Almendra"] },
        { title: "Barras c/ chocolate “Integra”", unit: "unidad", price: 15516, variants: ["Maní", "Arándanos"] },
        { title: "Barras bañadas en chocolate “Integra”", unit: "unidad", price: 24079, variants: ["Avellana", "Coco", "Banana", "Pasta de maní"] },
        { title: "Barras proteicas “Integra”", unit: "unidad", price: 20070, variants: ["Maní y arándanos", "Maní y chocolate", "Banana"] },
        { title: "Almohaditas “Lasfor”", description: "Chocolate negro", price: 9608 },
        { title: "Almohaditas “Lasfor”", price: 8606, variants: ["Frutilla", "Limón", "Avellana"] },
        { title: "Aritos de cereal “Lasfor”", price: 6631, variants: ["Miel", "Frutales"] },
        { title: "Bolitas de cereal", description: "Chocolate", price: 7107 },
        { title: "Copos de Maíz Azucarados", price: 3161 },
        { title: "Copos de Maíz sin Azúcar", price: 2760 },
        { title: "Bastón de Salvado", price: 5405 },
      ],
    },
    {
      name: "Repostería - Chocolates",
      products: [
        { title: "Rocklets", priceHalf: 11705, price: 21796 },
        { title: "Barras de Chocolate “Águila”", description: "Semiamargo", priceHalf: 14118, price: 26289 },
        { title: "Cacao Amargo", price: 12082 },
        { title: "Coco Rallado", priceHalf: 3281, price: 6109 },
        { title: "Azúcar Impalpable s/ TACC “Mayana”", price: 2681 },
        { title: "Azúcar Mascabo x 500g", unit: "unidad", price: 4050 },
      ],
    },
    {
      name: "Otros Productos",
      products: [
        { title: "Sal del Himalaya", priceHalf: 1297, price: 2415 },
        { title: "Sal Marina fina “Liberato”", price: 2460 },
        { title: "Yerba Mate Orgánica “Kalena” x 500g", unit: "unidad", price: 4228 },
        { title: "Yerba Mate “Kalena” Despalada x 500g", unit: "unidad", price: 5186 },
        { title: "Leche de Almendras 1L", unit: "unidad", price: 5967, variants: ["Original", "Vainilla", "Coco"] },
        { title: "Pasta de Maní “Dec” x 350 gr", unit: "unidad", price: 3683 },
        { title: "Mermeladas Variadas “Kony”", unit: "unidad", price: 7897 },
        { title: "Edulcorante Stevia Kony x 100 ml", unit: "unidad", price: 3153 },
        { title: "Esencia de Vainilla s/TACC x 100 ml", unit: "unidad", price: 1324 },
        { title: "Atún Lomito “Cumaná” x 170 gr", unit: "unidad", price: 3093 },
        { title: "Aceite de Coco “ChiaGraal” x 360 cc", unit: "unidad", price: 8399 },
        { title: "Aceite Oliva EV “Doña Juana” x 500 ml", unit: "unidad", price: 11729 },
      ],
    },
  ],
};
