import { Injectable } from '@angular/core';
import {EnumService} from '../services/enum.service';
import {AppDateCycles} from './app-date-cycles.enum';

@Injectable({
  providedIn: 'root'
})
export class AppDateCyclesService extends EnumService<AppDateCycles> {

  public readonly listOfEnum = [
    {value: AppDateCycles.day, label: '今日'},
    {value: AppDateCycles.week, label: '本周'},
    {value: AppDateCycles.month, label: '本月'},
    {value: AppDateCycles.year, label: '今年'},
  ];

  constructor() {
    super();
  }
}
