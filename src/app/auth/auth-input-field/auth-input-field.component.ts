import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-auth-input-field',
  templateUrl: './auth-input-field.component.html',
  styleUrls: ['./auth-input-field.component.scss']
})
export class AuthInputFieldComponent implements OnInit {
  @Input()
  isFocus = false;

  constructor(
  ) {
  }
  ngOnInit() {
  }

}
