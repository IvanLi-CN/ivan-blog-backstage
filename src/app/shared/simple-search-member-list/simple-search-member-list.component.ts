import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BaseIndexComponent } from 'src/app/core/base-index.component';
import { BaseListDto } from 'src/app/core/models/base-list.dto';
import { SimpleSearchMemberService } from './simple-search-member.service';

@Component({
  selector: 'app-simple-search-member-list',
  templateUrl: './simple-search-member-list.component.html',
  styleUrls: ['./simple-search-member-list.component.scss']
})
export class SimpleSearchMemberListComponent implements OnInit {

  private _selectdList = [];
  public get selectdList() {
    return this._selectdList;
  }
  @Input()
  public set selectdList(value) {
    this._selectdList = value;
  }
  mapOfCheckedId: { [key: string]: boolean } = {};
  @Output() memberSelectChange = new EventEmitter<any>();
  filterForm = this.fb.group({
    username: [null],
  });
  totalCount = 0;
  records = [];
  tempRecords = [];
  filter = {
    current: 1,
    skip: 0,
    take: 10,
  }

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public simpleSearchMemberService: SimpleSearchMemberService,
  ) {
  }

  ngOnInit() {
    this.records = this.selectdList;
    this.addTempRecords(this.records);
    this.totalCount = this.selectdList.length;
    this.records.forEach(record => {
      this.updateItemCheck(record, true);
    })
  }

  fetchMembers(isReset = false) {
    if (isReset) {
      this.filter.current = 1;
    }
    this.simpleSearchMemberService.fetchList({
      skip: (this.filter.current - 1) * this.filter.take,
      take: this.filter.take,
      ...this.filterForm.value,
    }).subscribe((data: any) => {
      this.totalCount = data.count;
      this.records = data.rows;
      this.addTempRecords(this.records);
    })
  }

  addTempRecords(records: any[]) {
    records.forEach((record: any) => {
      const item = this.tempRecords.find(temp => {
        return temp.id === record.id;
      });
      if (!item) {
        this.tempRecords.push(record);
      }
    });
    console.log(this.tempRecords);
  }

  updateItemCheck(item, isChecked) {
    if (isChecked) {
      this.checkedIdSet.add(item.id);
    } else {
      this.checkedIdSet.delete(item.id);
    }
    this.refreshStatus();
  }

  checkAll(isChecked) {
    if (isChecked) {
      this.records.forEach(item => (this.checkedIdSet.add(item.id)));
    } else {
      this.records.forEach(item => (this.checkedIdSet.delete(item.id)));
    }
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.records.every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate = this.records.some(item => (this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked);
    console.log(this.getCheckedItems());
    this.memberSelectChange.emit(this.getCheckedItems());
  }

  resetFilter() {
    this.filterForm.reset();
    this.fetchMembers(true);
  }

  checkedIdSet = new Set<any>();
  getCheckedIds() {
    return this.checkedIdSet.keys();
  }

  getItemCheck(item) {
    return this.checkedIdSet.has(item.id);
  }

  getCheckedItems() {
    const ids = new Set(this.getCheckedIds());
    return this.tempRecords.filter(item => ids.has(item.id));
  }
}
