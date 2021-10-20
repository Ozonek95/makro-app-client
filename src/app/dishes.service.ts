import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dish } from './dish';

@Injectable({
  providedIn: 'root'
})
export class DishesService {

  constructor(private http: HttpClient) { }

  addDish(value: Dish) {
    const request = {
      name: value.name,
      products: value.products.map(product => product.name),
    }
    return this.http.post<Dish>('http://localhost:8080/api/v1/dania/dodajDanie',request);
  }
  delete(danie: Dish) {
    return this.http.delete<Dish>('http://localhost:8080/api/v1/dania/'+danie.id);
  }

  getDishes() : Observable<Dish[]> {
    return this.http.get<Dish[]>('http://localhost:8080/api/v1/dania');
  }
}
