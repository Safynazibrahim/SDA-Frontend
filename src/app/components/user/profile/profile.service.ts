import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private _ApiServiceService: ApiServiceService) {}

  getDoctorProfile() {
    return this._ApiServiceService.get<any>('users/me');
  }

  updateProfile(payload: any){
    return this._ApiServiceService.patch<any>(`users/me`, payload);
  }
}
