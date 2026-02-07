import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClinicService } from '../clinic.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clinic-packages',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterLink,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    PaginationComponent,
    FormsModule
  ],
  templateUrl: './clinic-packages.component.html',
  styleUrls: ['./clinic-packages.component.scss'],
})
export class ClinicPackagesComponent {
  // 🔹 Pagination & filters
  CurrentPage = signal(1);
  limit = signal(3);
  searchName = signal('');
  searchNameValue = '';
  selectedType = signal<'clinic' | 'operator' | null>(null);
  language = signal<'en' | 'ar'>('en');

  constructor(
    private _MatSnackBar: MatSnackBar,
    private _ClinicService: ClinicService,
    private _Translate: TranslateService
  ) {
    // 👇 Detect current language from TranslateService
    this.language.set(this._Translate.currentLang === 'ar' ? 'ar' : 'en');

    // 👇 Update language signal if user switches language
    this._Translate.onLangChange.subscribe((e) => {
      this.language.set(e.lang === 'ar' ? 'ar' : 'en');
    });
  }

  // ⚙️ Computed params — re-fetch when page/type/search changes
  params = computed(() => ({
    page: this.CurrentPage(),
    limit: this.limit(),
    ...(this.selectedType() ? { type: this.selectedType() } : {}),
  }));

  // 🔹 TanStack Query (auto caching)
  packagesQuery = injectQuery(() => ({
    queryKey: ['packages', this.params()],
    queryFn: () => this._ClinicService.getPackages(this.params()),
    throwError: (err: any) => {
      this._MatSnackBar.open(
        err.error?.message || 'Something went wrong',
        'Close',
        {
          duration: 3000,
          panelClass: ['snackbar-error'],
        }
      );
    },
  }));

  get packages() {
    return this.packagesQuery.data()?.data || [];
  }

  get total() {
    return this.packagesQuery.data()?.total || 0;
  }

  // 🔹 Pagination
  onPageChange(page: number) {
    this.CurrentPage.set(page);
    this.packagesQuery.refetch();
  }

  // 🔹 Filter change
  onTypeChange(event: any) {
    this.selectedType.set(event.value);
    this.CurrentPage.set(1);
    this.packagesQuery.refetch();
  }

  // Helper to detect premium
  isPremium(pkg: any): boolean {
    return pkg.name.toLowerCase().includes('premium');
  }

  // Helper to display name in current language
  getPackageName(pkg: any): string {
    return this.language() === 'ar' ? pkg.nameAr || pkg.name : pkg.name;
  }

  getFeatureName(feature: any): string {
    return this.language() === 'ar'
      ? feature.nameAr || feature.name
      : feature.name;
  }

  // Helper for feature type label
  getFeatureLabel(feature: any): string {
    if (feature.type === 'unlimited')
      return this.language() === 'ar' ? 'غير محدود' : 'Unlimited';
    if (feature.type === 'limited') {
      return this.language() === 'ar'
        ? `محدود (${feature.limit})`
        : `Limited (${feature.limit})`;
    }
    if (feature.type === 'none') return 'PRO';
    return feature.type;
  }

}
