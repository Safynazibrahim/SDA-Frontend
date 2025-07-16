import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from './components/core/services/loader.service';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  private baseUrl = 'http://localhost:3000/api';
  

  constructor(private http: HttpClient, 
    private _LoaderService: LoaderService,
    private _Router: Router ) {}

  get<T>(endpoint: string): Observable<T> {
    this._LoaderService.show();
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`).pipe(
      finalize(() => this._LoaderService.hide())
    );
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    this._LoaderService.show();
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
      finalize(() => this._LoaderService.hide())
    );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
  this._LoaderService.show();
  return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
    finalize(() => this._LoaderService.hide())
  );
  }

//   private getHeaders(): HttpHeaders {
//   let headers = new HttpHeaders({
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   });

//   const token = localStorage.getItem('token');
//   if (token) {
//     headers = headers.set('Authorization', `Bearer ${token}`);
//   }

//   return headers;
// }

// get<T>(endpoint: string): Observable<T> {
//   this._LoaderService.show();
//   return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
//     headers: this.getHeaders(),
//   }).pipe(finalize(() => this._LoaderService.hide()));
// }

// post<T>(endpoint: string, data: any): Observable<T> {
//   this._LoaderService.show();
//   return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, {
//     headers: this.getHeaders(),
//   }).pipe(finalize(() => this._LoaderService.hide()));
// }

  logout() {
    localStorage.removeItem('token'); 
    this._Router.navigate(['/login']); 
  }

}
