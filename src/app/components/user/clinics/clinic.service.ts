import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

 constructor(private api: ApiServiceService) {}

  getClinics(params: any){
  return firstValueFrom(this.api.get('users/me/clinics', params));
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
  
  getAssignedCasesForEachClinic(clinicId:any,params: any) {
    return firstValueFrom(this.api.get<any>(`clinics/${clinicId}/assigned-cases`, params));
  }

  createClinic(params:any): Observable<any>{
    return this.api.post<any>('clinics', params);
  }
  getAvailableClinics(params: any): Observable<any> {
  return this.api.get<any>('clinics/available-clinics', params);
}
 joinClinic(id: string, payload: any): Observable<any> {
    return this.api.post<any>(`clinics/${id}/join-request`, payload);
  }
}
