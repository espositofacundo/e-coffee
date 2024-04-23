export interface Product {
    id: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: ValidSizes[];
    slug: string;
    tags: string[];
    title: string;
    type: ValidTypes;
    rootcategory: 'coffee'|'delicias';
}

export type Category = 'coffee' | 'delicias'
export type ValidSizes  = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type ValidTypes  = 'salado'|'dulce'|'infusiones'|'bebidas'|'saludable';