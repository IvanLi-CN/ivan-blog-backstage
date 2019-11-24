import {Component, Input, OnInit} from '@angular/core';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-up-or-down-indicator',
  templateUrl: './up-or-down-indicator.component.html',
  styleUrls: ['./up-or-down-indicator.component.scss']
})
export class UpOrDownIndicatorComponent implements OnInit {
  get lastValue(): number {
    return this.LocalLastValue;
  }
  @Input()
  set lastValue(value: number) {
    this.LocalLastValue = value;
    this.onChange();
  }
  get currValue(): number {
    return this.LocalCurrValue;
  }

  @Input()
  set currValue(value: number) {
    this.LocalCurrValue = value;
    this.onChange();
  }
  @Input()
  value = 0;

  private LocalCurrValue = 0;

  private LocalLastValue = 0;

  constructor() { }

  ngOnInit() {
  }

  onChange() {
    this.value = Decimal.sub(this.currValue || 0, this.lastValue || 0).toNumber();
  }

}
