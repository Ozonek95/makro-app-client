import { Component, Input, OnInit } from '@angular/core';
import { Result } from '../result';

@Component({
  selector: 'result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  @Input()
  result?: Result
  showInfo = true;

  constructor() { }

  ngOnInit(): void {
  }

  shouldShowInfoButton() {
    for(let dish of this.result?.dishResponseEntityList!) {
      if(dish.dishInfo.additionalInfo.length > 0) {
        return true;
      }
    }
    return false;
  }

  getInfoButtonString() {
    if(this.showInfo) {
      return "Ukryj dodatkowe informacje";
    } else {
      return "Pokaż dodatkowe informacje";
    }
  }

  changeShowInfo() {
    this.showInfo = !this.showInfo;
  }
}
