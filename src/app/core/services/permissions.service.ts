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
      children: [
        {
          id: '1400',
          title: '更新记录',
          path: '/dashboard/announcement-of-history',
          isHidden: true,
        },
      ],
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
    },
    {
      id: '400',
      title: '文章管理',
      icon: 'article',
      path: '/articles',
      children: [
        {id: '301', title: '发布文章', path: '/articles/publish'},
        {id: '302', title: '编辑文章', path: '/articles'},
      ]
    },
    {
      id: '500',
      title: '注单管理',
      icon: 'note-list-administration',
      children: [
        {id: '501', title: '彩票注单列表', path: '/note-list-management/lottery-note-list'},
      ]
    },
    {
      id: '600',
      title: '公告管理',
      icon: 'notice-administration',
      children: [
        {id: '601', title: '公告管理', path: '/public-administration/announcement'},
        {id: '602', title: '帮助内容管理', path: '/public-administration/help-content'},
        {id: '603', title: '更新日志管理', path: '/public-administration/update-log'},
      ]
    },
    {
      id: '700',
      title: '游戏管理',
      icon: 'game-administration',
      children: [
        {id: '701', title: '游戏类别', path: '/game-administration/game-type'},
        {id: '702', title: '平台列表', path: '/game-administration/platform-list'},
        {id: '703', title: '游戏列表', path: '/game-administration/game-list'},
      ]
    },
    {
      id: '800',
      title: '优惠管理',
      icon: 'discount-administration',
      children: [
        {id: '801', title: '优惠活动', path: '/discounts/discount-activities'},
        {id: '802', title: '优惠活动类别', path: '/discounts/discount-activity-categories'},
      ]
    },
    {
      id: '900',
      title: '财务管理',
      icon: 'finance-administration',
      children: [
        {id: '901', title: '存款与取款', path: '/financial-administration/deposit-and-withdrawals'},
        {id: '902', title: '支付类别管理', path: '/financial-administration/payments-manage'},
        {id: '903', title: '入款卡', path: '/financial-administration/io-card-manage/in'},
        {id: '904', title: '中转卡', path: '/financial-administration/io-card-manage/mid'},
        {id: '905', title: '出款卡', path: '/financial-administration/io-card-manage/out'},
        {id: '906', title: '入款管理', path: '/financial-administration/io-payment/in'},
        {id: '907', title: '出款管理', path: '/financial-administration/io-payment/out'},
        {id: '908', title: '支付平台管理', path: '/financial-administration/payment-platforms'},
        {id: '909', title: '在线支付管理', path: '/financial-administration/online-payments'},
        {id: '910', title: '运营商费用订单', path: '/financial-administration/company-payments'},
      ]
    },
    {
      id: '1000',
      title: '统计报表',
      icon: 'statistical-statement',
      children: [
        // {id: '1001', title: '平台报表', path: '/statistical-report/platform-report'},
        {id: '1002', title: '平台分润报表', path: '/statistical-report/platform-report/profit-distribution'},
        {id: '1003', title: '商务部报表', path: '/statistical-report/commerce-member-report'},
        {id: '1004', title: '商务部损益报表', path: '/statistical-report/commerce-member-report/profit-distribution'},
        {id: '1005', title: '公司报表', path: '/statistical-report/company-report'},
        // {id: '1006', title: '公司余额记录', path: '/statistical-report/company-report/balance-records'},
        {id: '1007', title: '公司分润报表', path: '/statistical-report/company-report/profit-distribution'},
        {id: '1008', title: '公司费用报表', path: '/statistical-report/company-report/costs'},
        {id: '1013', title: '卡报表', path: '/statistical-report/card-statement'},
        {id: '1012', title: '转卡明细', path: '/statistical-report/recard-details'},
        {id: '1014', title: '支付平台报表', path: '/statistical-report/payment-platform'},
        {id: '1015', title: '游戏报表', path: '/statistical-report/game-report-form'},
        {id: '1016', title: '游戏月报表', path: '/statistical-report/monthly-report-games'},
        {id: '1017', title: '开奖记录', path: '/statistical-report/record-of-award'},
        {id: '1018', title: '分润明细', path: '/statistical-report/divided-list'},
        {id: '1009', title: '代理损益报表', path: '/statistical-report/agent-income-statement'},
        {id: '1022', title: '用户余额记录', path: '/statistical-report/user-balance-record'},
      ]
    },
    {
      id: '1100',
      title: '权限管理',
      icon: 'jurisdiction-administration',
      children: [
        {id: '1101', title: '管理员管理', path: '/permissions/administrator-management'},
        {id: '1102', title: '权限群组', path: '/permissions/permission-groups'},
      ]
    },
    {
      id: '1200',
      title: '基础管理',
      icon: 'basic-settings',
      children: [
        {id: '1201', title: '图片管理', path: '/base-configurations/images'},
        {id: '1202', title: '基础配置', path: '/base-configurations/configurations'},
        {id: '1203', title: '域名管理', path: '/base-configurations/domains'},
      ]
    },
    {
      id: '1300',
      title: '系统安全',
      icon: 'system-safety',
      children: [
        {id: '1301', title: '操作记录', path: '/system-safety/operation-record'},
        {id: '1302', title: '登入日志', path: '/system-safety/login-log'},
        {id: '1303', title: 'IP限制', path: '/system-safety/restrictions'},
        {id: '1304', title: '谷歌验证器', path: '/system-safety/google-validation'},
      ]
    }];
  get permissions() {
    return this.allPermissions;
  }
  basePermissionIds = '';
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
  readonly availableMenu$: Observable<PermissionItem[]> = this.authService.currentUser$.pipe(
    switchMap(user => iif(
      () => !user,
      of([]),
        (() => {
          switch (user.type) {
            case UserTypes.admin:
              if (user.id !== 1 && !user.roleId) {
                return of([]);
              }
              return combineLatest([
                iif(
                  () => user.id === 1,
                  this.permissionIds$,
                  this.fetchOne(user.roleId).pipe(
                    tap(role => this.currentRoleInfo = role),
                    pluck('permission'),
                    map(str => JSON.parse(str as string)),
                    pluck('activatedMenuIds'),
                  ),
                ).pipe(
                  // map(ids => {
                  //   const set = new Set(ids);
                  //   set.delete('302');
                  //   return Array.from(set);
                  // }),
                ),
                of(this.permissions),
              ]).pipe(
                filter(([permissionIds, localPermissions]) => !!permissionIds && !!localPermissions),
                map(([permissionIds, localPermissions]: [string[], PermissionItem[]]) => {
                  return localPermissions
                    .filter(
                      permission =>
                        permissionIds.includes(permission.id) ||
                        permission.children.some(item => permissionIds.includes(item.id))
                    )
                    .map(permission => ({
                      ...permission,
                      children: permission.children.filter(item => permissionIds.includes(item.id))
                    }));
                }),
              );
            default:
              return of(this.permissions).pipe(
                tap(() => this.currentRoleInfo = {name: this.userTypesService.getLabel(user.type)}),
                switchMap(permissions => of(permissions).pipe(
                  switchMap(menus => from(menus).pipe(
                    switchMap(menu => of(Array.isArray(menu.children) ? [menu, ...menu.children] : [menu]).pipe(
                      switchMap(pages => from(pages).pipe(
                        filter(page => (this.permissionIds4Role[user.type] || []).includes(page.id)),
                        toArray(),
                        switchMap((availablePages: PermissionItem[]) => iif(
                          () => availablePages.length > 0,
                          of({
                            ...menu,
                            children: availablePages,
                          }),
                          of()
                        )),
                      )),
                    ))
                  )),
                  toArray(),
                )),
              );
          }
        })(),
      )
    ),
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

  fetchOne(id: number): Observable<any> {
    return this.http.get<any>(
      '/api/role',
      {params: this.convertQueryDtoToHttpParams({id})}
    ).pipe(
      take(1),
      map(dto => dto.rows[0]),
      map(dto => ({
        ...dto,
        permission: dto.permission ? dto.permission : '[]',
      }))
    );
  }

  remove(id: number): Observable<any> {
    return this.http.delete<any>(
      '/api/role',
      {params: this.convertQueryDtoToHttpParams({id})}
    ).pipe(
      take(1),
    );
  }

  create(dto): Observable<any> {
    return this.http.post<any>(
      '/api/role',
      dto,
    ).pipe(
      take(1),
    );
  }

  modify(id: number, dto): Observable<any> {
    return this.http.put<any>(
      '/api/role',
      {...dto, id},
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
