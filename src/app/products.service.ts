import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produkt } from './produkt';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProducts() : Observable<Produkt[]> {
    return this.http.get<Produkt[]>('http://localhost:8080/api/v1/produkty');
  }

  insertProduct(value: any): Observable<Produkt> {
    const produkt = {
      "name":value.name,
      "makroZrodlo":value.makroZrodlo,
      "quantityInHundredGrams":value.quantityInHundredGrams
    }

    console.log('dodaje produkt', produkt);

    return this.http.post<Produkt>('http://localhost:8080/api/v1/produkty/dodajProdukt',produkt);
  }

  delete(product: Produkt) {
    return this.http.delete<Produkt>('http://localhost:8080/api/v1/produkty/'+product.id);
  }
}
