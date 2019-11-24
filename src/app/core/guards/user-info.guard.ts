import { Injectable } from '@angular/core';
import {CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {map, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserInfoGuard implements CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.currentUser$.pipe(
      map(user => !!user),
      take(1),
      tap(value => { if (!value) { this.router.navigate(['/auth/login']); } }));
  }
}
