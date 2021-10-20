export interface Produkt {
  id: number,
  name: string,
  makroZrodlo: MakroZrodlo,
  quantityInHundredGrams: number,
}

export enum MakroZrodlo {
 WHEY,
 FAT,
 CARBO,
}