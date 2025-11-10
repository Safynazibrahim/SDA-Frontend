import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StartCaseStateService {
  private startCaseData: any = null;
  private clinicId: string | null = null;

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  setStartCaseData(data: any) {
    this.startCaseData = data;
    if (this.isBrowser()) {
      localStorage.setItem('startCaseData', JSON.stringify(data));
    }
  }

  getStartCaseData(): any {
    if (this.startCaseData) return this.startCaseData;
    if (!this.isBrowser()) return null;

    const stored = localStorage.getItem('startCaseData');
    return stored ? JSON.parse(stored) : null;
  }

  clearStartCaseData() {
    this.startCaseData = null;
    if (this.isBrowser()) {
      localStorage.removeItem('startCaseData');
    }
  }

  setClinicId(id: string) {
    this.clinicId = id;
    if (this.isBrowser()) {
      localStorage.setItem('clinicId', id);
    }
  }

  getClinicId(): string | null {
    if (this.clinicId) return this.clinicId;
    if (!this.isBrowser()) return null;

    const stored = localStorage.getItem('clinicId');
    return stored ? stored : null;
  }

  clearClinicId() {
    this.clinicId = null;
    if (this.isBrowser()) {
      localStorage.removeItem('clinicId');
    }
  }
}
