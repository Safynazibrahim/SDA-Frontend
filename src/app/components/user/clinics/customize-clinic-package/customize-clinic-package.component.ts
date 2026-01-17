import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Directionality } from '@angular/cdk/bidi';
import { ClinicService } from '../clinic.service';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customize-clinic-package',
  standalone: true,
  imports: [
    TranslateModule,
    RouterLink,
    MatIcon,
    CommonModule,
    FormsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    ModalComponent,
  ],
  templateUrl: './customize-clinic-package.component.html',
  styleUrl: './customize-clinic-package.component.scss',
})
export class CustomizeClinicPackageComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private _MatSnackBar:MatSnackBar,
    private _ClinicService: ClinicService,
    private cd: ChangeDetectorRef,
  ) {}

  features: any[] = [];
  subscriptionMonths: number = 1;
  quickMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  lang: 'ar' | 'en' = 'en';
  viewDescModal = false;
  clickableDesc: any;

  ////
  totalPrice: number | null = null;
  isCalculating = false;
  isCreating = false;
  priceCalculatedForSignature: string | null = null;

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.lang = this.translate.currentLang as 'ar' | 'en';
      this.cd.detectChanges();
    });
    this.getFeatures();
  }

  setMonths(m: number) {
    this.subscriptionMonths = m;
    this.onSelectionChanged();
  }

  getFeatures() {
    this._ClinicService.getFeatures().subscribe({
      next: (res) => {
        this.features = res;
      },
    });
  }

  openDescModal(desc: any) {
    this.viewDescModal = true;
    this.clickableDesc = desc;
  }
  closeDescModal() {
    this.viewDescModal = false;
  }

  onSelectionChanged() {
    this.totalPrice = null;
    this.priceCalculatedForSignature = null;
  }

  private ensureFeatureDefaults(f: any) {
    // when enabling first time, force a valid type + limit
    if (!f.type) f.type = null; // keep null until user chooses (for your UX)
    if (f.limit == null || f.limit < 1) f.limit = 1;
  }

  onFeatureToggleChanged(f: any, enabled: boolean) {
    f.enabled = enabled;

    if (enabled) {
      this.ensureFeatureDefaults(f);
    } else {
      // optional: reset selections when disable
      f.type = null;
      f.limit = 1;
    }

    this.onSelectionChanged();
  }

  onFeatureTypeChanged(f: any) {
    if (f.type === 'limited') {
      if (!f.limit || f.limit < 1) f.limit = 1;
    } else {
      // if unlimited, keep limit as 1 internally but we won't send it
      f.limit = 1;
    }
    this.onSelectionChanged();
  }

  onLimitChanged(f: any) {
    // clamp always
    const n = Number(f.limit);
    f.limit = isNaN(n) || n < 1 ? 1 : Math.floor(n);
    this.onSelectionChanged();
  }

  get canCalculate(): boolean {
    if (this.selectedFeaturesCount === 0) return false;

    return this.selectedFeatures.every((f) => {
      // must choose type
      if (!f.type) return false;

      // if limited -> limit must be >= 1
      if (f.type === 'limited') {
        return Number(f.limit) >= 1;
      }

      return true; // unlimited OK
    });
  }

  private buildSelectedFeaturesPayload() {
    return this.selectedFeatures.map((f) => {
      const payload: any = {
        key: f.key,
        type: f.type || 'unlimited',
      };

      // ابعت limit فقط لو limited
      if (payload.type === 'limited') {
        payload.limit = Number(f.limit ?? 1);
      }

      return payload;
    });
  }

  private buildSignature() {
    return JSON.stringify({
      months: this.subscriptionMonths,
      features: this.buildSelectedFeaturesPayload(),
    });
  }

  calculatePrice() {
    if (this.selectedFeaturesCount === 0) return;

    const payload = {
      durationInMonths: this.subscriptionMonths,
      features: this.buildSelectedFeaturesPayload(),
    };

    this.isCalculating = true;

    this._ClinicService.calculatePackagePrice(payload).subscribe({
      next: (res: any) => {
        this.totalPrice = res?.totalPrice ?? res?.price ?? res;
        this.priceCalculatedForSignature = this.buildSignature();
        this.isCalculating = false;
      },
      error: (err) => {
        this.isCalculating = false;
        this._MatSnackBar.open(err.error.message, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  createAndPay() {
    // لازم السعر يكون محسوب و الاختيارات ما اتغيرتش بعدها
    const currentSignature = this.buildSignature();
    if (
      !this.totalPrice ||
      this.priceCalculatedForSignature !== currentSignature
    ) {
      // خلي المستخدم يحسب تاني
      this.calculatePrice();
      return;
    }

    const payload = {
      type: 'clinic',
      durationInMonths: this.subscriptionMonths,
      features: this.buildSelectedFeaturesPayload(),
    };

    this.isCreating = true;

    this._ClinicService.createCustomPackage(payload).subscribe({
      next: (res: any) => {
        this.isCreating = false;
        this._MatSnackBar.open('Package customized successfully', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });

        // هنا بعدين هتعمل route لصفحة الدفع
        // مثال:
        // this.router.navigate(['/payment'], { queryParams: { packageId: res.id } });
      },
      error: (err) => {
        this.isCreating = false;
        this._MatSnackBar.open(err.error.message, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  get selectedFeatures() {
    return this.features.filter((f) => f.enabled);
  }

  get selectedFeaturesCount(): number {
    return this.selectedFeatures.length;
  }
}
