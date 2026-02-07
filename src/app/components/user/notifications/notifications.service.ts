import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private _ApiServiceService:ApiServiceService) { }

  getNotifications(params: { page: number; limit: number }) {
    return this._ApiServiceService.get('notifications', params);
  }

  markAsRead(id: number) {
    return this._ApiServiceService.patch(`notifications/${id}/mark-as-read`, {});
  }
  
}
