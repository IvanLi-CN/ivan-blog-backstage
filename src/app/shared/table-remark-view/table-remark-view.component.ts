import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-remark-view',
  templateUrl: './table-remark-view.component.html',
  styleUrls: ['./table-remark-view.component.scss']
})
export class TableRemarkViewComponent implements OnInit {


  get value() {
    return this.val;
  }

  set value(val) {
    this.val = val;
  }

  @Input('value')
  val: string;
  constructor() { }

  ngOnInit() {
  }

}
