export interface Result {
 dishResponseEntityList: DishResponseEntity[],
}

export interface DishResponseEntity {
 name: string,
 dishInfo: DishInfo,
}

export interface DishInfo {
 productQuantities: ProductQuantity[],
 additionalInfo: string[],
}

export interface ProductQuantity {
 name: string,
 quantity: number,
}