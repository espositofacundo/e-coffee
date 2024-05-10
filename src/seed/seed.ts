import bcryptjs from 'bcryptjs'


export interface Product {
 
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: ValidSizes[];
  slug: string;
  tags: string[];
  title: string;
  type: ValidTypes;
  rootcategory: "coffee" | "delicias";
}

interface SeedUser {
  email: string;
  password: string;
  role: "admin" | "user";
}

export type ValidSizes = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";
export type ValidTypes =
"Cafeteria" | "Desayunos" | "Batidos" | "Licuados" | "Tostadas" | "Pasteleria" | "Sandwiches" | "Wraps" | "Tartas" | "Ensaladas" | "Principales" | "Postres" | "Bebidas" | "Promociones"

interface SeedData {
  users: SeedUser[];
  categories: string[];
  products: Product[];
}

export const initialData: SeedData = {
    users: [
    {
      email: "prueba1@email.com",
      password: bcryptjs.hashSync('123123'),
      role: "admin",
    },
    {
        email: "prueba2@email.com",
        password: bcryptjs.hashSync('123123'),
        role: "admin",
      },
      {
        email: "prueba3@email.com",
        password: bcryptjs.hashSync('123123'),
        role: "user",
      },
  ],

  categories: [
    "Cafeteria",
    "Desayunos",
    "Batidos",
    "Licuados",
    "Tostadas",
    "Pasteleria",
    "Sandwiches",
    "Wraps",
    "Tartas",
    "Ensaladas",
    "Principales",
    "Postres",
    "Bebidas",
    "Promociones"
  ],

  products: [
    {
      description:
        "Introducing the Tesla Chill Collection. The coffee’s Chill Crew Neck Sweatshirt has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The sweatshirt features a subtle thermoplastic polyurethane T logo on the chest and a Tesla wordmark below the back collar. Made from 60% cotton and 40% recycled polyester.",
      images: ["1740176-00-A_0_2000.jpg", "1740176-00-A_1.jpg"],
      inStock: 7,
      price: 75,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      slug: "coffees_chill_crew_neck_sweatshirt",
      type: "Cafeteria",
      tags: ["sweatshirt"],
      title: "coffee’s Chill Crew Neck Sweatshirt",
      rootcategory: "coffee",
    },
    
  ],
};
