import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {filter, map, pluck, switchMap, take, tap, toArray} from 'rxjs/operators';
import {combineLatest, from, iif, Observable, of, ReplaySubject} from 'rxjs';
import {PermissionItem} from '../models/permission-item.model';
import {AuthService} from '../../auth/auth.service';
import {UserTypes} from '../enums/user-types.enum';
import {BaseApiService} from './base-api.service';
import {HttpClient} from '@angular/common/http';
import {BaseListDto} from '../models/base-list.dto';
import {QueryPermissionGroupsDto} from '../models/query-permission-groups.dto';
import {UserTypesService} from '../enums/user-types.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService extends BaseApiService {
  allPermissions: PermissionItem[] = [
    {
      id: '101',
      title: '仪表盘',
      path: '/dashboard',
      icon: 'dashboard',
    },
    {
      id: '200',
      title: '账号管理',
      icon: 'account',
      path: '/accounts',
    },
    {
      id: '300',
      title: '文章管理',
      icon: 'article',
      path: '/articles',
      children: [
        {id: '301', title: '发布文章', path: '/articles/publish'},
        {id: '302', title: '编辑文章', path: '/articles'},
      ]
    }];
  get permissions() {
    return this.allPermissions;
  }
  basePermissionIds = [];
  permissionIds4Role = {
    [UserTypes.companyAgent]: ['204', '1003', '1004', '1005', '1007', '1018'],
    [UserTypes.playerAgent]: ['202', '205', '1009', '1018'],
    [UserTypes.keFu]: ['205', '302', '901', '902', '907', '909', '1022'],
    [UserTypes.financialStaffDepositGroup]: ['901', '906', '1022'],
    [UserTypes.financialStaffPaymentGroup]: ['901', '907', '1022'],
    [UserTypes.financialStaffDirector]: ['901', '903', '904', '905', '906', '907', '909', '1013', '1014', '1022', '902'],
  };
  currentMenuItem: any;
  currentRoleInfo: any;
  readonly availablePageIds$: Observable<string[]> = this.authService.currentUser$.pipe(
    switchMap(user => iif(
      () => !user,
      of([]),
      this.permissionIds$
      ),
    ),
  );
  readonly availableMenu$: Observable<PermissionItem[]> = combineLatest(
    this.availablePageIds$,
    of(this.permissions),
  ).pipe(
    map(([ids, pages]) =>
      from(pages).pipe(
        switchMap(page =>
          from(ids).pipe(
            filter(id => id === page.id)
          )
        )
      ),
    ),
    toArray(),
    tap(console.log),
  );
  readonly availablePages$: Observable<PermissionItem[]> = this.availableMenu$.pipe(
    switchMap(availableMenus => of(availableMenus).pipe(
      switchMap(menus => from(menus)),
      map(menus => Array.isArray(menus.children) ? [menus, ...menus.children] : [menus]),
      switchMap(pages => from(pages)),
      toArray(),
    )),
  );

  readonly permissionIds$: Observable<string[]> = of(this.permissions).pipe(
    switchMap(availableMenus => of(availableMenus).pipe(
      switchMap(menus => from(menus)),
      map(menus => Array.isArray(menus.children) ? [menus, ...menus.children] : [menus]),
      switchMap(pages => from(pages)),
      pluck('id'),
      toArray(),
    )),
  );
  private routePath = new ReplaySubject(1);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userTypesService: UserTypesService,
    protected http: HttpClient,
  ) {
    super(http);
    this.permissions.forEach(menu1 => {
      if (Array.isArray(menu1.children)) {
        menu1.children.forEach(menu2 => menu2.parent = menu1);
      }
    });
    this.watch4Title();
  }

  fetchList(queryDto: QueryPermissionGroupsDto): Observable<BaseListDto<any>> {
    return this.http.get<BaseListDto<any>>(
      '/api/role',
      {params: this.convertQueryDtoToHttpParams(queryDto)}
    ).pipe(
      take(1),
    );
  }

  private watch4Title() {
    this.router.events.pipe(
      pluck('snapshot'),
      filter(snapshot => !!snapshot),
    ).subscribe((snapshot: ActivatedRouteSnapshot) => {
      // @ts-ignore
      const pathArr = snapshot._routerState.url.split('/');
      pathArr[pathArr.length - 1] = pathArr[pathArr.length - 1].split('?')[0];
      const flatMenuArr = this.permissions.reduce((previousValue, currentValue) => {
        if (Array.isArray(currentValue.children) && currentValue.children.length !== 0) {
          return [...previousValue, ...currentValue.children];
        } else {
          return [...previousValue, currentValue];
        }
      }, []);
      this.currentMenuItem = flatMenuArr.find(p => p.path === pathArr.join('/'));
    });
  }

}
