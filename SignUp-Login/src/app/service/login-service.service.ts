import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginServiceService implements OnInit {
  private isLoggedIn = new ReplaySubject<boolean>(1);
  loggedIn$ = this.isLoggedIn.asObservable();

  private userNameSubject = new BehaviorSubject<string>('');
  userName$ = this.userNameSubject.asObservable();

  public baseUrl = 'http://localhost:3000';

  constructor(
  private http: HttpClient,
  @Inject(PLATFORM_ID) private platformId: Object
) {
  if (isPlatformBrowser(this.platformId)) {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');

    this.isLoggedIn.next(!!token);
    this.userNameSubject.next(userName || '');
  }
}

  ngOnInit(): void {}
  signup(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }

  login(data: any): Observable<any> {
    return new Observable((observer) => {
      this.http.post(`${this.baseUrl}/login`, data).subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('isLoggedIn', 'true');
          this.userNameSubject.next(res.userName);
          localStorage.setItem('userName', res.userName);
          this.isLoggedIn.next(true);
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err),
      });
    });
  }
  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
  }
}
