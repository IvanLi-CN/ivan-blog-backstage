import {Component, Input, OnInit} from '@angular/core';
import {EnumService} from '../../core/services/enum.service';

@Component({
  selector: 'app-enum-perview',
  templateUrl: './enum-preview.component.html',
  styleUrls: ['./enum-preview.component.scss']
})
export class EnumPreviewComponent implements OnInit {

  @Input()
  enumService: EnumService<any>;
  @Input()
  enumValue: string | number | boolean;


  constructor() { }

  ngOnInit() {
  }

}
