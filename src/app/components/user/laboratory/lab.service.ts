import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabService {

  constructor(private _ApiServiceService: ApiServiceService) {}

  getLabs(params: any): Promise<any> {
    return firstValueFrom(
      this._ApiServiceService.get('labs', params)
    );
  }

  getNearByLabs(params: any) {
    return firstValueFrom(
      this._ApiServiceService.get<any>(
        `labs/nearby`,
        params
      )
    );
  }
}
