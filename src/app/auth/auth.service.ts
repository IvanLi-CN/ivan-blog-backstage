import {Injectable} from '@angular/core';
import {catchError, pluck, switchMapTo, take, tap} from 'rxjs/operators';
import {Observable, of, ReplaySubject, timer} from 'rxjs';
import {LoggedUser} from './logged-user.model';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly currentUserSubject = new ReplaySubject<LoggedUser>(1);
  readonly currentUser$: Observable<LoggedUser> = this.currentUserSubject;
  public currUser: LoggedUser;
  private accessToken: string = null;

  constructor(
    protected apollo: Apollo,
  ) {
    this.currentUser$.subscribe(currUser => this.currUser = currUser);
    timer(100).pipe(switchMapTo(this.autoLogin())).subscribe();
  }

  fetchCaptcha() {
    // return this.http.get('/openapi/captcha.svg', {responseType: 'blob'}).pipe(
    //   flatMap(image => {
    //     const subject = new ReplaySubject<string>(1);
    //     const reader = new FileReader();
    //     reader.addEventListener('load', () => {
    //       subject.next(this.sanitizer.bypassSecurityTrustUrl(reader.result as string) as string);
    //     }, false);
    //     if (image) {
    //       reader.readAsDataURL(image);
    //     } else {
    //       subject.thrownError(new Error('无法读取到图片'));
    //     }
    //     return subject;
    //   }),
    // );
  }

  login(dto) {
    const tmp = {...dto};
    for (const key of Object.keys(tmp)) {
      if (!tmp[key]) {
        tmp[key] = null;
      }
    }
    return this.apollo.mutate({
      mutation: gql`
        mutation ($account: String!, $password: String!){
          adminLogin(account: $account, password: $password){
            id
            account
            nick
            systemRole
          }
        }
      `,
      variables: tmp,
    }).pipe(
      tap(console.log),
      take(1),
      pluck('data'),
      tap(user => this.currentUserSubject.next(user as LoggedUser)),
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    setTimeout(() => {
      this.currentUserSubject.next(null);
    }, 50);
    // return this.http.get('/api/users/logout').pipe(
    //   take(1),
    // );
    return of();
  }

  autoLogin(): Observable<LoggedUser> {
    return this.apollo.watchQuery<{ currAccount: LoggedUser }>({
      query: gql`
        {
          currAccount{
            id
            account
            nick
            systemRole
          }
        }
      `
    }).valueChanges.pipe(
      take(1),
      pluck('data'),
      pluck('currAccount'),
      tap(user => this.currentUserSubject.next(user)),
      catchError((err => {
        console.error(err);
        return of<LoggedUser>();
      }))
    );
  }

  updateAccessToken(token) {
    this.accessToken = token;
    localStorage.setItem('access_token', token);
  }

  getAccessToken() {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('access_token');
    }
    return this.accessToken;
  }
}
