import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private _isLoading = false;

  get isLoading(): boolean {
    return this._isLoading;
  }

  show() {
    this._isLoading = true;
  }

  hide() {
    this._isLoading = false;
  }

}
