import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiServiceService } from '../../../../api-service.service';

@Injectable({
  providedIn: 'root',
})
export class ReferralService {
  constructor(private _ApiServiceService: ApiServiceService) {}

  getDoctorsOfClinic(clinicId: any, params: any) {
    return firstValueFrom(
      this._ApiServiceService.get<any>(`clinics/${clinicId}/doctors`, params)
    );
  }

  getDoctorsOfAnotherClinic(params: any) {
    return firstValueFrom(
      this._ApiServiceService.get<any>(
        `cases/referrals/doctors-to-refer`,
        params
      )
    );
  }

  referCase(
    caseId: number,
    body: {
      referredDoctorId: string;
      recoveryDays: number;
      note: string;
    }
  ) {
    return firstValueFrom(
      this._ApiServiceService.post(`cases/${caseId}/refer`, body)
    );
  }
}
