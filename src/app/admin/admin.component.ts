import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { PermissionsService } from '../core/services/permissions.service';
import { AuthService } from '../auth/auth.service';
import { PermissionItem } from '../core/models/permission-item.model';
import { from, Observable, Subscription } from 'rxjs';
import { map, switchMap, toArray, filter } from 'rxjs/operators';
import { UserTypes } from '../core/enums/user-types.enum';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    public route: ActivatedRoute,
    public permissionsService: PermissionsService,
    public authService: AuthService,
  ) { }
  isCollapsed = false;
  needInnerPadding = true;

  visibleMenuItems$: Observable<PermissionItem[]> = this.permissionsService.availableMenu$.pipe(
    map(items => items.filter(item => !item.isHidden)),
    switchMap(items => from(items).pipe(
      map(item => {
        if (Array.isArray(item.children)) {
          item.children = item.children.filter(subItem => !subItem.isHidden);
        }
        return item;
      }),
      toArray(),
    )),
  );
  ngOnInit() {
    this.authService.autoLogin().subscribe();
  }

  ngOnDestroy() {
  }
  goto(item) {
    // @ts-ignore
    if ('/' + this.route.snapshot._urlSegment.segments.join('/') === item.path) {
      return;
    }
    return this.router.navigate([item.path]);
  }

  gotoLogout() {
    this.router.navigate(['auth/logout']).then(() => {
      window.location.reload();
    });
  }
}
