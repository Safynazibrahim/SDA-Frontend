import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LabService {
  constructor(private _ApiServiceService: ApiServiceService) {}

  getLabs(params: any): Promise<any> {
    return firstValueFrom(this._ApiServiceService.get('labs', params));
  }

  getNearByLabs(params: any) {
    return firstValueFrom(
      this._ApiServiceService.get<any>(`labs/nearby`, params),
    );
  }

  getLabDetails(labId: any) {
    return firstValueFrom(this._ApiServiceService.get<any>(`labs/${labId}`));
  }

  createOrderRequest(labId: string, formData: FormData) {
    return this._ApiServiceService.post(`labs/${labId}/orders`, formData);
  }

  getRequests(params: any) {
    return firstValueFrom(
      this._ApiServiceService.get<any>(`doctors/me/labs/links`, params),
    );
  }

  getOrders(params: any) {
    return firstValueFrom(
      this._ApiServiceService.get<any>(`doctors/me/labs/orders`, params),
    );
  }

  getExpenses() {
    return firstValueFrom(
      this._ApiServiceService.get<any>(`doctors/me/labs/total-expenses`),
    );
  }

  getOrderDetails(orderId: number) {
    return firstValueFrom(
      this._ApiServiceService.get<any>(`labs/orders/${orderId}`),
    );
  }

  updateOrderStatus(orderId: number, body: { status: string }) {
    return this._ApiServiceService.patch(`labs/orders/${orderId}/status`, body);
  }
  sendLinkRequest(body: { labId: string }) {
    return this._ApiServiceService.post('labs/links/send-request', body);
  }
}
