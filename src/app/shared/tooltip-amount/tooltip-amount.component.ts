import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tooltip-amount',
  templateUrl: './tooltip-amount.component.html',
  styleUrls: ['./tooltip-amount.component.scss']
})
export class TooltipAmountComponent implements OnInit {
  get value(): number | string {
    return this.val;
  }
  @Input()
  set value(value: number | string) {
    this.val = +value;
  }
  private val: number | string;
  @Input()
  digitsInfo = '1.2-2';

  constructor() { }

  ngOnInit() {
  }

}
