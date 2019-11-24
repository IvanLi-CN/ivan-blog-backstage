import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.authService.logout().subscribe(() => {
      this.message.info('您已安全退出系统！');
      this.router.navigate(['/auth/login']);
    }, () => {
      this.message.warning('您已退出！');
      this.router.navigate(['/auth/login']);
    });
  }

}
