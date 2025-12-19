import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private _ApiServiceService:ApiServiceService) { }

  getNotifications(params:any): Promise<any> {
    return firstValueFrom(this._ApiServiceService.get('notifications', params));
  }
  
}
