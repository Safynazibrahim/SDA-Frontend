import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private _ApiServiceService:ApiServiceService) { }

  signUpDoctor(formData:FormData): Observable<any>{
    return this._ApiServiceService.post(`auth/signup/doctor`, formData)
  }

login(data: { email: string; password: string }): Observable<any> {
  return this._ApiServiceService.post('auth/signin', data).pipe(
    map((res: any) => res)
  );
}

  
  requestOTP(formData:FormData): Observable<any>{
    return this._ApiServiceService.put(`auth/request-otp`, formData)
  }

  verifyOTP(data: { email: string; otp: string }) {
  return this._ApiServiceService.put('auth/verify-otp', data);
  }

  resetPassword(data: { newPassword: string; }){
    return this._ApiServiceService.put('auth/reset-password', data);
  }

  // login(data: any): Observable<any> {
  // return this.api.post('auth/login', data).pipe(
  //   map((res: any) => {
  //     if (res?.token) {
  //       localStorage.setItem('token', res.token);
  //     }
  //     return res;
  //   })
  // );
  //}


}
