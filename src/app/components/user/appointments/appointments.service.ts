import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  constructor(private api : ApiServiceService) { }

  assignCase(params: any): Observable<any> {
    return this.api.post<any>('cases/assign', params);
  }
  startCase(params: any , caseId : any): Observable<any> {
    return this.api.post<any>(`cases/${caseId}/start`, params);
  }
showAvailableTimeSlots(
  clinicId: any,
  recoveryPeriodInDays: any,
  searchWindowInDays: any
): Observable<any> {
  const params = {
    clinicId,
    recoveryPeriodInDays,
    searchWindowInDays
  };

  return this.api.get<any>('doctors/available-slots', params);
}
bookAppointment(params: any): Observable<any> {
  return this.api.post<any>('appointments', params);
}

}
