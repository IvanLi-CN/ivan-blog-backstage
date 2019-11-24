import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnumService<T> {

  public readonly listOfEnum = [];

  constructor() { }

  getLabel(enumValue: T) {
    const item = this.listOfEnum.find(v => v.value === enumValue);
    return item && item.label;
  }

  getValue(enumLabel: string) {
    const item = this.listOfEnum.find(v => v.label === enumLabel);
    return item && item.value;
  }

  getFilterData() {
    return this.listOfEnum.map(v => ({
      text: v.label,
      value: v.value,
    }));
  }

}
