import { Component, OnInit } from '@angular/core';
import {filter, map, take} from 'rxjs/operators';
import {Router} from '@angular/router';
import {PermissionsService} from '../../core/services/permissions.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(
    private permissionService: PermissionsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.permissionService.availablePages$.pipe(
      take(1),
      map(menuItems => menuItems[0] || null),
      filter(firstMenuItem => !!firstMenuItem),
    ).subscribe(item => {
      console.log(item);
      this.router.navigateByUrl(item.path, {replaceUrl: true}).then(() => {});
    });
  }

}
