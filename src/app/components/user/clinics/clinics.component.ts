import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClinicService } from './clinic.service';
import { MatIconModule } from '@angular/material/icon';
import { SearchComponent } from '../../shared/search/search.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ClinicFeaturesService } from '../../core/services/clinic-features.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map } from 'rxjs';
declare const L: any;

@Component({
  selector: 'app-clinics',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    PaginationComponent,
    RouterModule,
    FormsModule,
    MatIconModule,
    SearchComponent,
    ModalComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './clinics.component.html',
  styleUrl: './clinics.component.scss'
})
export class ClinicsComponent implements OnInit{

  constructor(
    private router: Router,
    private clinicsService: ClinicService,
    private _MatSnackBar: MatSnackBar,
    private _ClinicFeaturesService:ClinicFeaturesService,
    private _FormBuilder:FormBuilder
  ) {}

  // 🔹 Reactive signals for state
  ownerCurrentPage = signal(1);
  operatorCurrentPage = signal(1);
  subOwnerCurrentPage = signal(1);
  limit = signal(10);
  searchName = signal('');
  searchNameValue = ''; 
  isCreateClinicModalOpen = false;
  form!: FormGroup;
  lat: number | null = null;
  lng: number | null = null;
  showMap: boolean = false;

    ngOnInit(): void {
    this.form = this._FormBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      location: ['', [Validators.required, Validators.maxLength(200)]],
      specialization: ['', [Validators.required, Validators.maxLength(100)]],
      branchesCount: [1, [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]],
      ownerName: [''],
      existsInSystem: [null, Validators.required]
    });

    // ✅ Owner name validator toggling
    this.form.get('existsInSystem')?.valueChanges.subscribe((val) => {
      const ownerControl = this.form.get('ownerName');
      if (val === true) {
        ownerControl?.setValidators([Validators.required, Validators.maxLength(100)]);
      } else {
        ownerControl?.clearValidators();
        ownerControl?.setValue('');
      }
      ownerControl?.updateValueAndValidity();
    });

    // ✅ Watch manual location typing → auto-geocode
    this.form.get('location')?.valueChanges.subscribe((value) => {
      if (value && !this.showMap) {
        this.forwardGeocode(value);
      }
    });
  }

  // 🔹 Forward geocoding (address → lat/lng)
  forwardGeocode(address: string) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      .then(res => res.json())
      .then(results => {
        if (results.length > 0) {
          this.lat = parseFloat(results[0].lat);
          this.lng = parseFloat(results[0].lon);
        }
      })
      .catch(err => console.error('Geocode error:', err));
  }

  // 🔹 Reverse geocoding (lat/lng → address)
  reverseGeocode(lat: number | null, lng: number | null) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.display_name) {
          this.form.get('location')?.setValue(data.display_name);
        }
      })
      .catch(err => console.error('Reverse geocode error:', err));
  }

  // 🔹 Get current location and auto-fill map + address
  getCurrentLocation() {
    if (!navigator.geolocation) {
      this._MatSnackBar.open('Location is not supported', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
      return;
    }

    this.showMap = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

        // 🔹 Reverse geocode to readable address
        this.reverseGeocode(this.lat, this.lng);

        // 🔹 Initialize map
        setTimeout(() => {
          const map = L.map('map').setView([this.lat!, this.lng!], 13);
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);

          const marker = L.marker([this.lat!, this.lng!], { draggable: true }).addTo(map);

          // 🔹 Update address when marker moved
          marker.on('dragend', (event: any) => {
            const pos = event.target.getLatLng();
            this.lat = pos.lat;
            this.lng = pos.lng;
            this.reverseGeocode(this.lat, this.lng);
          });

          setTimeout(() => map.invalidateSize(), 300);
        }, 200);
      },
      (error) => {
        console.error('Error getting location:', error);
        this._MatSnackBar.open('Error getting location', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      }
    );
  }

  
  watchPosistion() {
    let desLat = 0;
    let id = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log('lat', this.lat);
        console.log('lng', this.lng);
        if (lat === desLat) {
          navigator.geolocation.clearWatch(id);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }

  // ⚙️ Computed params that trigger auto re-fetch
  params = computed(() => ({
    ownerPage: this.ownerCurrentPage(),
    operatorPage: this.operatorCurrentPage(),
    subOwnerPage: this.subOwnerCurrentPage(),
    limit: this.limit(),
    name: this.searchName().trim(),
  }));

  // 🔹 TanStack query (auto caching + reactive)
  clinicsQuery = injectQuery(() => ({
    queryKey: ['clinics'],
    queryFn: () => this.clinicsService.getClinics(this.params()),
    throwError: (err:any) => {
    this._MatSnackBar.open(err.error.message, 'Close', {
      duration:3000,
      panelClass:['snackbar-error']
    });
  },
  }));

  // 🧩 Getters for easy template use
  get isLoading() {
    return this.clinicsQuery.isLoading();
  }

  get data(): any {
  const response:any = this.clinicsQuery.data() || {};

  // 🧩 Inject static features مؤقتًا
  if (response?.ownerClinics?.data?.length) {
    response.ownerClinics.data = response.ownerClinics.data.map((clinic:any, index:any) => {
      if (index === 0) {
        // 🟢 Premium package — everything unlimited
        clinic.features = {
          add_material: { type: 'unlimited' },
          assigned_cases: { type: 'unlimited' },
          inventory: { type: 'unlimited' },
        };
      } else if (index === 1) {
        // 🔴 Basic package — assigned_cases locked (pro)
        clinic.features = {
          add_material: { type: 'unlimited' },
          assigned_cases: { type: 'none' }, // PRO feature
          inventory: { type: 'unlimited' },
        };
      } else {
        // 🟠 Standard package — add_material limited
        clinic.features = {
          add_material: { type: 'limited', limit: 10, remaining: 3 },
          assigned_cases: { type: 'unlimited' },
          inventory: { type: 'unlimited' },
        };
      }
      return clinic;
    });
  }
  if (response?.subOwnerClinics?.data?.length) {
    response.subOwnerClinics.data = response.subOwnerClinics.data.map((clinic:any, index:any) => {
      if (index === 0) {
        // 🟢 Premium package — everything unlimited
        clinic.features = {
          add_material: { type: 'unlimited' },
          assigned_cases: { type: 'unlimited' },
          inventory: { type: 'unlimited' },
        };
      } else if (index === 1) {
        // 🔴 Basic package — assigned_cases locked (pro)
        clinic.features = {
          add_material: { type: 'none' },
          assigned_cases: { type: 'none' }, // PRO feature
          inventory: { type: 'unlimited' },
        };
      } else {
        // 🟠 Standard package — add_material limited
        clinic.features = {
          add_material: { type: 'limited', limit: 10, remaining: 3 },
          assigned_cases: { type: 'unlimited' },
          inventory: { type: 'unlimited' },
        };
      }
      return clinic;
    });
  }
  if (response?.operatorClinics?.data?.length) {
    response.operatorClinics.data = response.operatorClinics.data.map((clinic:any, index:any) => {
      if (index === 0) {
        // 🟢 Premium package — everything unlimited
        clinic.features = {
          add_material: { type: 'unlimited' },
          assigned_cases: { type: 'unlimited' },
          inventory: { type: 'unlimited' },
        };
      } else if (index === 1) {
        // 🔴 Basic package — assigned_cases locked (pro)
        clinic.features = {
          add_material: { type: 'none' },
          assigned_cases: { type: 'none' }, // PRO feature
          inventory: { type: 'unlimited' },
        };
      } else {
        // 🟠 Standard package — add_material limited
        clinic.features = {
          add_material: { type: 'limited', limit: 10, remaining: 3 },
          assigned_cases: { type: 'unlimited' },
          inventory: { type: 'unlimited' },
        };
      }
      return clinic;
    });
  }

  return response;
}


  get ownerClinics() {
    return this.data?.ownerClinics?.data || [];
  }

  get operatorClinics() {
    return this.data?.operatorClinics?.data || [];
  }

  get subOwnerClinics() {
    return this.data?.subOwnerClinics?.data || [];
  }

  get ownerTotal() {
    return this.data?.ownerClinics?.total || 0;
  }

  get operatorTotal() {
    return this.data?.operatorClinics?.total || 0;
  }

  get subOwnerTotal() {
    return this.data?.subOwnerClinics?.total || 0;
  }

  // 🔹 Search handler
  onSearch() {
    this.searchName.set(this.searchNameValue);
    this.ownerCurrentPage.set(1);
    this.operatorCurrentPage.set(1);
    this.subOwnerCurrentPage.set(1);
    this.clinicsQuery.refetch();
  }

  // 🔹 Pagination handlers
  onOwnerPageChange(page: number) {
    this.ownerCurrentPage.set(page);
    this.clinicsQuery.refetch();
  }

  onOperatorPageChange(page: number) {
    this.operatorCurrentPage.set(page);
    this.clinicsQuery.refetch();
  }

  onSubOwnerPageChange(page: number) {
    this.subOwnerCurrentPage.set(page);
    this.clinicsQuery.refetch();
  }

  openCreateModal(){
    this.isCreateClinicModalOpen = true;
  }

  closeCreateClinic(){
    this.isCreateClinicModalOpen = false;
  }

  // 🔹 Navigation
  goToJoinClinic() {
    this.router.navigate(['/dashboard/clinics/join']);
  }

  goToOperatorPackage() {
    this.router.navigate(['/dashboard/clinics/operatorPackage']);
  }

  goToClinicPackage() {
    this.router.navigate(['/dashboard/clinics/clinicPackage']);
  }

  goToClinicDetails(clinic: any) {
    this._ClinicFeaturesService.setClinicFeatures(clinic.features);
    console.log(clinic)
    this.router.navigate(['/dashboard/clinics', clinic.id]);
  }


  submit(){
    if (this.form.invalid) {
    this.form.markAllAsTouched();
    this._MatSnackBar.open('Please fill all required fields', 'Close', {
      duration: 2000,
      panelClass: ['snackbar-error']
    });
    return;
  }

  const payload = {
    name: this.form.value.name,
    location: this.form.value.location,
    specialization: this.form.value.specialization,
    branchesCount: this.form.value.branchesCount,
    ownerName: this.form.value.ownerName || null,
    existsInSystem: this.form.value.existsInSystem,
    locationPoint: {
      lat: this.lat ?? 0,
      lng: this.lng ?? 0
    }
  };
    this.clinicsService.createClinic(payload).subscribe({
      next: (res) => {
        this._MatSnackBar.open( 'Clinc created successfully', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        });
        this.closeCreateClinic();
        this.form.reset();
        this.showMap = false;
        this.lat = null;
        this.lng = null;
        this.clinicsQuery.refetch();
      },
      error: (err) => {
        this._MatSnackBar.open( err.error.message, 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
      }
    });
  }

}
