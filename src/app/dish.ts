import { Produkt } from "./produkt";

export interface Dish {
 id: number,
 name: string,
 products: Produkt[],
}