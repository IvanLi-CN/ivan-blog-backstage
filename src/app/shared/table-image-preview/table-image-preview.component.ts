import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-table-image-preview',
  templateUrl: './table-image-preview.component.html',
  styleUrls: ['./table-image-preview.component.styl']
})
export class TableImagePreviewComponent implements OnInit {
  get src(): string {
    return this._src;
  }

  @Input()
  set src(value: string) {
    this.isError = !value;
    this._src = value;
  }
  // tslint:disable-next-line:variable-name
  private _src: string;

  isError = false;

  constructor() { }

  ngOnInit() {
  }

  imgLoadError() {
    this.isError = true;
  }
}
