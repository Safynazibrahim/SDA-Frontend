import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  constructor(private api : ApiServiceService) { }

  assignCase(params: any): Observable<any> {
    return this.api.post<any>('cases/start', params);
  }

}
