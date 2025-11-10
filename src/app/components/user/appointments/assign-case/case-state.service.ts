import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface CaseBasicData {
  caseId: number;
  appointmentId: string;
  chiefComplaint: string;
}

@Injectable({
  providedIn: 'root'
})
export class CaseStateService {
  private caseIdSource = new BehaviorSubject<number | null>(null);
  caseId$ = this.caseIdSource.asObservable();

  private caseData: CaseBasicData | null = null;

  /** 🔒 Helper للتأكد إن الكود شغال داخل المتصفح */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  setCaseId(id: number) {
    this.caseIdSource.next(id);
    if (this.isBrowser()) {
      localStorage.setItem('caseId', id.toString());
    }
  }

  setCaseData(data: CaseBasicData) {
    this.caseData = data;
    if (this.isBrowser()) {
      localStorage.setItem('caseData', JSON.stringify(data));
    }
  }

  getCaseData(): CaseBasicData | null {
    if (this.caseData) return this.caseData;

    if (!this.isBrowser()) return null;

    const stored = localStorage.getItem('caseData');
    return stored ? JSON.parse(stored) : null;
  }

  clearCase() {
    this.caseIdSource.next(null);
    this.caseData = null;

    if (this.isBrowser()) {
      localStorage.removeItem('caseId');
      localStorage.removeItem('caseData');
    }
  }
}
