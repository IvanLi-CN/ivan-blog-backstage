import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Moment} from 'moment';
import * as moment from 'moment';
import {map, switchMap} from 'rxjs/operators';
import {AppDateCycles} from '../enums/app-date-cycles.enum';
import {AppDateGranularity} from '../enums/app-date-granularity';

@Injectable({
  providedIn: 'root'
})
export class DateHelperService {

  constructor() {
  }

  getArrDateOfCurrMonth(date: Moment | Date): Moment[] {
    const month = moment(date).startOf('M');
    const arrDate: Moment[] = [];
    for (let i = 0, currDate = month.clone().startOf('M'); i < month.daysInMonth(); i++) {
      arrDate.push(currDate.clone().add({days: i}));
    }
    return arrDate;
  }

  getArrDateOfCurrYear(date: Moment | Date): Moment[] {
    const month = moment(date).startOf('y');
    const arrDate: Moment[] = [];
    for (let i = 0, currDate = month.clone().startOf('y'); i < 12; i++) {
      arrDate.push(currDate.clone().add({month: i}));
    }
    return arrDate;
  }

  getArrDateOfCurrWeek(date: Moment | Date): Moment[] {
    const month = moment(date).startOf('w');
    const arrDay: Moment[] = [];
    for (let i = 0, currDay = month.clone().startOf('w'); i < 7; i++) {
      arrDay.push(currDay.clone().add({day: i}));
    }
    return arrDay;
  }

  getArrDateOfCurrDay(date: Moment | Date): Moment[] {
    const month = moment(date).startOf('w');
    const arrHour: Moment[] = [];
    for (let i = 0, currHour = month.clone().startOf('h'); i < 7; i++) {
      arrHour.push(currHour.clone().add({h: i}));
    }
    return arrHour;
  }

  getTimeArr4Now(date: Moment | Date | string | number, cycle: AppDateCycles) {
    return this[`getArrDateOfCurr${cycle[0].toUpperCase()}${cycle.slice(1)}`](date);
  }

  getTimeArr4Range(startAt: Moment | Date | string | number, endAt: Moment | Date | string | number, granularity: AppDateGranularity) {
    const end = moment(endAt).startOf(granularity);
    const arr = [];
    for (const curr = moment(startAt).startOf(granularity).clone().subtract(1, granularity); curr.isBefore(end) ; ) {
      arr.push(curr.add(1, granularity).clone().startOf(granularity));
    }
    return arr;
  }
}
