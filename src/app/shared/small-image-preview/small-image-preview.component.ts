import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-small-image-preview',
  templateUrl: './small-image-preview.component.html',
  styleUrls: ['./small-image-preview.component.styl']
})
export class SmallImagePreviewComponent implements OnInit {
  @Input()
  src: string;

  constructor() {
  }

  ngOnInit() {
  }

}
