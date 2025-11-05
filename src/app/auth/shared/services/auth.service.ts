import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/user';

  // POST request for login
  login(user_email: string): Observable<any> {
    const body = { user_email };
    return this.http.post<any>(`${this.baseUrl}/login`, body);
  }

  // POST request for verification
  verify(token: string, code: string): Observable<any> {
    const body = { token, code };
    return this.http.post<any>(`${this.baseUrl}/verify`, body);
  }

  // Register request
  register(name: string, email: string, password: string, phonenumber: string): Observable<any> {
    const body = { name, email, password, phonenumber };
    return this.http.post<any>(`${this.baseUrl}/register`, body);
  }

}
