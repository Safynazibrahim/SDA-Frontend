import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, last } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  get<T>(endpoint: string, params: any = {}): Observable<T> {
    let headers = new HttpHeaders().set('Accept', 'application/json');

    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] != null) httpParams = httpParams.set(key, params[key]);
    });

    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, {
        headers,
        params: httpParams,
        withCredentials: true,
      })
      .pipe(
      catchError((err) => {
        // ✅ مهم جدًا علشان الـ interceptor يشوف الـ error
        return throwError(() => err);
      })
    );
  }
  
  post<T>(endpoint: string, data: any, reportProgress = false): Observable<T> {
  let headers = new HttpHeaders();

  // ❌ Don't force JSON if data is FormData
  if (!(data instanceof FormData)) {
    headers = headers.set('Content-Type', 'application/json');
  }

  if (reportProgress) {
    const req = new HttpRequest('POST', `${this.baseUrl}/${endpoint}`, data, {
      headers,
      reportProgress: true,
      withCredentials: true,
    });

    return this.http.request(req).pipe(
      map((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percent = Math.round((100 * event.loaded) / event.total);
          return { percent } as any;
        }
        if (event.type === HttpEventType.Response) {
          return event.body;
        }
      }),
      last()
    );
  }

  return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, {
    headers,
    withCredentials: true,
  });
  }

  postDirect<T>(endpoint: string, data: any): Observable<T> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-Skip-Interceptor', 'true'); // header خاص للتمييز

    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, {
      headers,
      withCredentials: true,
    });
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, {
      headers,
      withCredentials: true,
    });
  }

  delete<T>(endpoint: string, params: any = {}): Observable<T> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] != null) httpParams = httpParams.set(key, params[key]);
    });

    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, {
      headers,
      params: httpParams,
      withCredentials: true,
    });
  }

  // 🔹 Logout
  logout() {
    this.router.navigate(['/login']);
  }
}