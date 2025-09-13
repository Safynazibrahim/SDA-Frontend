import { response } from 'express';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
declare const L: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
    CommonModule,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  currentStep = 1;
  showPassword = false;
  registerForm!: FormGroup;
  medicalLicense: File | null = null;
  certificate: File[] = [];
  showMap: boolean = false;
  lng:any;
  lat:any;

  constructor(
    private _AuthService: AuthService,
    private fb: FormBuilder,
    private _MatSnackBar: MatSnackBar,
    private _Router:Router
  ) {}
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      doctor: this.fb.group({
        fullName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/), // At least 1 uppercase & 1 number
          ],
        ],
        specialization: ['', Validators.required],
      }),
      clinic: this.fb.group({
        name: ['', Validators.required],
        location: ['', Validators.required],
        specialization: ['', Validators.required],
        branchesCount: [
          '',
          [Validators.required, Validators.pattern(/^[0-9]+$/)],
        ],
      }),
    });
  }

  nextStep() {
    if (this.currentStep === 1 && this.registerForm.get('doctor')?.invalid)
      return;
    this.currentStep++;
  }

  previousStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getCurrentLocation() {
    if (!navigator.geolocation) {
      this._MatSnackBar.open('Location is not supported', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
    }
    this.showMap = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        console.log('lat', this.lat);
        console.log('lng', this.lng);
        let map = L.map('map').setView([this.lat, this.lng], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
        var marker = L.marker([this.lat, this.lng]).addTo(map);
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
    this.watchPosistion();
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

  onFileSelected(event: any, field: 'medicalLicense' | 'certificate') {
    const files: FileList = event.target.files;

    console.log(event);

    if (field === 'medicalLicense') {
      this.medicalLicense = files[0];
    } else {
      this.certificate = Array.from(files);
    }
  }

  triggerFileInput(inputId: string) {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  submitForm() {
    if (this.registerForm.invalid) return;

    const formData = new FormData();

    if (this.medicalLicense) {
      formData.append('medicalLicense', this.medicalLicense);
    }

    this.certificate.forEach((file) => {
      formData.append('academicCertificates', file);
    });

    formData.append('doctor', JSON.stringify(this.registerForm.value.doctor));
    formData.append('clinic', JSON.stringify(this.registerForm.value.clinic));

    this._AuthService.signUpDoctor(formData).subscribe({
      next: (response: any) => {
        this._MatSnackBar.open("Registered successfully", 'Close', { duration: 3000, panelClass: ['snackbar-success'] });
        this._Router.navigate(['/login']);
      },
      error: (err: any) => {
        this._MatSnackBar.open(err.error.message, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });   
  }
}
