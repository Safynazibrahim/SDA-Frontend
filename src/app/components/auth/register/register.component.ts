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
  lng: any;
  lat: any;

  constructor(
    private _AuthService: AuthService,
    private fb: FormBuilder,
    private _MatSnackBar: MatSnackBar,
    private _Router: Router
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
        phoneNumber: ['+2', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/), // At least 1 uppercase & 1 number
          ],
        ],
      }),
      clinic: this.fb.group({
        specialization: ['', Validators.required],
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

    // Files
    if (this.medicalLicense) {
      formData.append('medicalLicense', this.medicalLicense);
    }
    this.certificate.forEach((file) => {
      formData.append('academicCertificates', file);
    });

    // Step 1: Doctor basic info
    formData.append(
      'fullName',
      this.registerForm.get('doctor.fullName')?.value
    );
    formData.append('email', this.registerForm.get('doctor.email')?.value);
    // Always add +2 if not already included
    let phone = this.registerForm.get('doctor.phoneNumber')?.value;
    if (phone && !phone.startsWith('+2')) {
      phone = '+2' + phone;
    }
    formData.append('phoneNumber', phone);
    formData.append(
      'password',
      this.registerForm.get('doctor.password')?.value
    );

    // Step 2: Professional data
    formData.append(
      'specialization',
      this.registerForm.get('clinic.specialization')?.value
    );

    this._AuthService.signUpDoctor(formData).subscribe({
      next: () => {
        this._MatSnackBar.open('Registered successfully', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
        this._Router.navigate(['/login']);
      },
      error: (err) => {
        this._MatSnackBar.open(err.error.message, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }
}
