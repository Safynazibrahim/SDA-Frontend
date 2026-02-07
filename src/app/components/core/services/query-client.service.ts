import { Injectable } from '@angular/core';
import { QueryClient } from '@tanstack/angular-query-experimental';

@Injectable({ providedIn: 'root' })
export class QueryClientService {
  constructor(public queryClient: QueryClient) {}

  clear() {
    this.queryClient.clear(); 
  }
}
