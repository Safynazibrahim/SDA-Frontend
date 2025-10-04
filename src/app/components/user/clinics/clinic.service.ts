import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

 constructor(private api: ApiServiceService) {}

  getClinics(params: any): Observable<any> {
  return this.api.get<any>('users/me/clinics', params);
}
getAppointmentForClinic(id: string, date?: string): Observable<any> {
  const params: any = {};

  if (date) {
    params.date = date;
  }

  return this.api.get<any>(`clinics/${id}/appointments`, params);
}
getAllAppointments(date?: string): Observable<any> {
  const params: any = {};

  if (date) {
    params.date = date;
  }

  return this.api.get<any>(`users/me/appointments`, params);
}
}
