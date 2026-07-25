import {Brand} from "./brand";
import {Caategory} from "./category";
import {ProductImage} from "./product-image";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    isDeleted: boolean;
    brandId: number;
    categoryId: number;
    brand: Brand;
    category: Caategory;
    images: ProductImage[];
    isActive: boolean;
    createdAt: string;
}