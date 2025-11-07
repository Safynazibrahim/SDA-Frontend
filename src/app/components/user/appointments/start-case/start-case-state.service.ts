import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StartCaseStateService {
  private startCaseData: any = null;
  private clinicId: string | null = null;

  setStartCaseData(data: any) {
    this.startCaseData = data;
    localStorage.setItem('startCaseData', JSON.stringify(data));
  }

  getStartCaseData(): any {
    if (this.startCaseData) return this.startCaseData;

    const stored = localStorage.getItem('startCaseData');
    return stored ? JSON.parse(stored) : null;
  }

  clearStartCaseData() {
    this.startCaseData = null;
    localStorage.removeItem('startCaseData');
  }
  setClinicId(id: string) {
    this.clinicId = id;
    localStorage.setItem('clinicId', id);
  }

  getClinicId(): string | null {
    if (this.clinicId) return this.clinicId;
    const stored = localStorage.getItem('clinicId');
    return stored ? stored : null;
  }

  clearClinicId() {
    this.clinicId = null;
    localStorage.removeItem('clinicId');
  }
}
