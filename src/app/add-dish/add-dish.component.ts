import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Dish } from '../dish';
import { DishesService } from '../dishes.service';
import { NotificationService } from '../notification.service';
import { ProductsService } from '../products.service';
import { Produkt } from '../produkt';
import { map, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-add-dish',
  templateUrl: './add-dish.component.html',
  styleUrls: ['./add-dish.component.css']
})
export class AddDishComponent implements OnInit {


  public productOptions: string[] = [];
  public filteredOptions?: Observable<string[]>[] = [];
  public produkty: Produkt[] = [];
  public dania: Dish[] = [];
  public nameOfAddedDish: string = "";
  public productsForNewDish: string[] = [];
  formDish: FormGroup;

  constructor(private productService: ProductsService, private dishService: DishesService, private notificationService: NotificationService, private fb: FormBuilder) {
    this.formDish = this.fb.group({
      name: ['',[Validators.required]], 
      products: this.fb.array([]),
    });
  }

  private _filter(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.productOptions.filter(option => option.toLowerCase().includes(filterValue));
    }
    return [];
  }


  getFilteredOptions(i: number): void {
    this.filteredOptions![i] = this.formDish.get('products')!.valueChanges
      .pipe(
        map(value => value[i].name),
        startWith(''),
        map(value => this._filter(value))
      );
  }

  get productForms(): FormArray {
    return this.formDish.get('products') as FormArray;
  }

  addProduct() {
    const product = this.fb.group({
      name: ['',[Validators.required]]
    })

    this.productForms.push(product);
    this.getFilteredOptions(this.productForms.length - 1);
  }

  deleteProduct(i: number) {
    this.productForms.removeAt(i);
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(result => {
      this.produkty = result
      this.productOptions = result.map(produkt => produkt.name);
    });
    this.dishService.getDishes().subscribe(result => this.dania = result);
  }

  delete(danie: Dish) {
    this.dishService.delete(danie).subscribe(result => {
      this.notificationService.showInfo("Pomyślnie usunięto.", "OK");
      this.getDishesFromServer();
    });
  }

  onSubmit() {
    this.dishService.addDish(this.formDish.value).subscribe(result => {
      this.notificationService.showInfo("Pomyślnie dodano.", "OK");
      this.getDishesFromServer();
    }, err => {
      console.log("error", err);
      this.notificationService.showInfo("ERROR " + err.error.message, "OK")
    });
    this.formDish.reset();
  }


  getDishesFromServer() {
    this.dishService.getDishes().subscribe(result => this.dania = result);
  }

}
