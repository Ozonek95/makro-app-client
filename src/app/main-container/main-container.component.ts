import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalculationService } from '../calculation.service';
import { Dish } from '../dish';
import { DishesService } from '../dishes.service';
import { MakroZrodlo, Produkt } from '../produkt';
import { Result } from '../result';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent implements OnInit {
  rulesForm: FormGroup;
  makroQuantityForm: FormGroup;

  dishes: Dish[] = [];
  selectedDishes: Dish[] = [];
  panelOpenState = false;
  currentResult?: Result;

  constructor(private dishesService: DishesService, private claculationService: CalculationService, private fb: FormBuilder) {
    this.makroQuantityForm = this.fb.group({
      fat: ['', [Validators.required]],
      carbo: ['', [Validators.required]],
      whey: ['', [Validators.required]],
    });

    this.rulesForm = this.fb.group({
      rules: this.fb.array([]),
    })
  }

  ngOnInit(): void {
    this.dishesService.getDishes()
      .subscribe(result => this.dishes = result);
  }

  rules(): FormArray {
    return this.rulesForm.get("rules") as FormArray
  }

  newRule(): FormGroup {
    return this.fb.group({
      dishName: ['', [Validators.required]],
      productRuleInfos: this.fb.array([])
    })
  }

  newProductRule(): FormGroup {
    return this.fb.group({
      productName: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
    })
  }

  addRule() {
    this.rules().push(this.newRule());
  }

  removeRule(ruleIndex: number) {
    this.rules().removeAt(ruleIndex);
  }

  productRuleInfos(ruleIndex: number): FormArray {
    return this.rules().at(ruleIndex).get("productRuleInfos") as FormArray
  }

  newProductRuleInfo(product: Produkt): FormGroup {
    return this.fb.group({
      product: product,
      quantity: ['', [Validators.required]],
    })
  }

  addProductRuleInfo(ruleIndex: number, product: Produkt) {
    this.productRuleInfos(ruleIndex).push(this.newProductRuleInfo(product));
  }

  removeProductRuleInfo(ruleIndex: number, productRuleInfoIndex: number) {
    this.productRuleInfos(ruleIndex).removeAt(productRuleInfoIndex);
  }

  public onDishesChange($event: Dish[]) {
    this.selectedDishes = $event;
  }

  public getSelectedDishes(): Dish[] {
    return this.selectedDishes;
  }

  public getProductsForDish(dish: Dish) {
    return dish.products;
  }

  getProductsForDishByRuleIndex(ruleIndex: number): Produkt[] {
    const dish = this.dishes.filter(dish => dish.name === this.rules().controls[ruleIndex].value.dishName)
    if (dish.length) {
      const productsThatNeedRule = [];

      const numberOfWheyProducts = this.getProductByMakro(dish[0].products, 'WHEY').length;

      const numberOfCarboProducts = this.getProductByMakro(dish[0].products, 'CARBO').length;

      const numberOfFatProducts = this.getProductByMakro(dish[0].products, 'FAT').length;

      if (numberOfWheyProducts > 1) {
        productsThatNeedRule.push(...this.getProductByMakro(dish[0].products, 'WHEY'));
      }

      if (numberOfCarboProducts > 1) {
        productsThatNeedRule.push(...this.getProductByMakro(dish[0].products, 'CARBO'));
      }

      if (numberOfFatProducts > 1) {
        productsThatNeedRule.push(...this.getProductByMakro(dish[0].products, 'FAT'));
      }
      return productsThatNeedRule;
    }
    return [];
  }

  getAllSelectedProducts(): Produkt[] {
    const products = this.selectedDishes.map(dish => dish.products);
    let mergedProducts: Produkt[] = [];
    for (const productArray of products) {
      mergedProducts = mergedProducts.concat(productArray);
    }

    return [...new Set(mergedProducts)].sort();
  }

  submitAll() {
    const request = {
      dishes: this.selectedDishes,
      makro: this.makroQuantityForm.value,
      rules: this.rulesForm.value.rules,
    }

    this.claculationService.getResults(request).subscribe(result => {
      this.currentResult = result;
    })
  }

  dishesWithRuleRequired(): Dish[] {
    const dishesWithRules = [];
    for (const dish of this.selectedDishes) {
      const numberOfWheyProducts = this.getProductByMakro(dish.products, 'WHEY').length;

      const numberOfCarboProducts = this.getProductByMakro(dish.products, 'CARBO').length;

      const numberOfFatProducts = this.getProductByMakro(dish.products, 'FAT').length;

      if (numberOfWheyProducts > 1 || numberOfCarboProducts > 1 || numberOfFatProducts > 1) {
        dishesWithRules.push(dish);
      }
    }

    return dishesWithRules;
  }

  getProductByMakro(products: Produkt[], makro: string): Produkt[] {
    return products.filter(product => product.makroZrodlo.toString() === makro);
  }

  dishSelectedToAddRules(ruleIndex: number) {
    const productsToSetQuantity = this.getProductsForDishByRuleIndex(ruleIndex);
    const productsToSetQuantityLength = productsToSetQuantity.length;

    for (let i = 0; i < productsToSetQuantityLength; i++) {
      this.addProductRuleInfo(ruleIndex, productsToSetQuantity[i]);
    }
  }

  isFormValid(): boolean {
    return this.rulesForm.invalid || this.makroQuantityForm.invalid || this.selectedDishes.length === 0;
  }

  getFirstChar(string: string) {
    return '('+string.charAt(0)+')';
  }
}
