import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  ///////save patient data from patient list to view in patient profile
  private selectedPatientSource = new BehaviorSubject<any>(this.loadPatientFromStorage());
  selectedPatient$ = this.selectedPatientSource.asObservable();

  private loadPatientFromStorage(): any {
    const data = localStorage.getItem('selectedPatient');
    return data ? JSON.parse(data) : null;
  }

  setSelectedPatient(patient: any) {
    this.selectedPatientSource.next(patient);
    localStorage.setItem('selectedPatient', JSON.stringify(patient));
  }

  getSelectedPatient() {
    return this.selectedPatientSource.value;
  }

  clearSelectedPatient() {
    this.selectedPatientSource.next(null);
    localStorage.removeItem('selectedPatient');
  }
  //////////////////////////////////

  constructor(private _ApiServiceService:ApiServiceService) { }

  getPatients(params:any): Promise<any> {
    return firstValueFrom(this._ApiServiceService.get('users/me/patients', params));
  }
 
  getPatientAppointmentHistory(patientId:any,params?:any): Observable<any> {
    return this._ApiServiceService.get<any>(`patients/${patientId}/appointments/history`, params);
  }

  getPatientDentalHistory(patientId:any,params?:any): Observable<any> {
    return this._ApiServiceService.get<any>(`patients/${patientId}/cases`, params);
  }

  // getAssignedCases(): Observable<any>{
  //   return this._ApiServiceService.get<any>(`clinics/assigned-cases`, params);
  // }



}
