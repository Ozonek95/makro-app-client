import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from './result';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  constructor(private http: HttpClient) { }

  getResults(request: any) : Observable<Result> {
    console.log('request ', request)


    return this.http.post<any>('http://localhost:8080/api/v1/calculation', request);
  }
}
