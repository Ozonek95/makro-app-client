import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NotificationService } from '../notification.service';
import { ProductsService } from '../products.service';
import { Produkt } from '../produkt';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  public produkty: Produkt[] = [];

  public makroOptions = [
    { "name": "Białko", "checked": true, "value": 0 },
    { "name": "Tłuszcz", "checked": false, "value": 1 },
    { "name": "Węgle", "checked": false, "value": 2 },
  ];


  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    name: new FormControl('', Validators.required),
    makroZrodlo: new FormControl(0),
    quantityInHundredGrams: new FormControl('',[Validators.required, Validators.min(1), Validators.max(100)]),
  })
  constructor(private produktService: ProductsService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getProductsFromServer();
  }

  private getProductsFromServer() {
    this.produktService.getProducts()
      .subscribe(result => this.produkty = result);
  }

  getProducts(nazwaMakro: string): Produkt[] {
    return this.produkty.filter(produkt => produkt.makroZrodlo.toString() === nazwaMakro);
  }

  onSubmit() {
    if (this.form.valid) {
      this.produktService.insertProduct(this.form.value).subscribe(result => {
        this.notificationService.showInfo("Pomyślnie dodano.", "OK");
        this.getProductsFromServer();
      }, err => {
        console.log("error", err);
        this.notificationService.showInfo("ERROR " + err.error.message, "OK")
      });
      this.form.reset();
      this.initializeFormGroup();
    }
  }

  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      name: '',
      makroZrodlo: 0,
      quantityInHundredGrams: 0,
    })



    this.makroOptions = [
      { "name": "Białko", "checked": true, "value": 0 },
      { "name": "Tłuszcz", "checked": false, "value": 1 },
      { "name": "Węgle", "checked": false, "value": 2 },
    ];
  }

  delete(product: Produkt) {
    this.produktService.delete(product).subscribe(result => {
      this.notificationService.showInfo("Pomyślnie usunięto.", "OK");
      this.getProductsFromServer();
    });
  }
}
