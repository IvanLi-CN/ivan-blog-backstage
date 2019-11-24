import {Injectable} from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {map, take, tap} from 'rxjs/operators';
import {PermissionsService} from '../services/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authService: AuthService,
    private permissionService: PermissionsService,
    private router: Router,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.permissionService.availableMenu$.pipe(
      take(1),
      map((menu) =>
        menu.reduce((previousValue, currentValue) => {
          if (Array.isArray(currentValue.children) && currentValue.children.length > 0) {
            return [...previousValue, ...currentValue.children];
          } else {
            return [...previousValue, currentValue];
          }
        }, [])),
      map(flatMenuItems => [...flatMenuItems, {path: '/'}]),
      map(flatMenuItems => !!flatMenuItems.find(item => item.path === '/' + segments.join('/'))),
    );
  }
}
