import { Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LabService } from '../../../../lab.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../../../../shared/modal/modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lab-details',
  standalone: true,
  imports: [
    MatIcon,
    TranslateModule,
    CommonModule,
    ModalComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './lab-details.component.html',
  styleUrl: './lab-details.component.scss',
})
export class LabDetailsComponent {
  labId!: string;
  labDetails = signal<any>(null);
  isRequestModal = false;

  orderForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _LabService: LabService,
    private fb: FormBuilder,
    private _MatSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.labId = this.route.snapshot.paramMap.get('labId')!;
    this.initForm();
    this.getLabDetails();
  }

  initForm() {
    this.orderForm = this.fb.group({
      name: ['', Validators.required],
      deadline: ['', Validators.required],
      notes: [''],
      services: this.fb.array([], Validators.required),
    });
  }

  get servicesArray(): FormArray {
    return this.orderForm.get('services') as FormArray;
  }

  getLabDetails() {
    this._LabService.getLabDetails(this.labId).then((res) => {
      this.labDetails.set(res);
    });
  }

  toggleService(serviceId: number) {
    this.servicesArray.clear();
    this.servicesArray.push(this.fb.control(serviceId));
  }

  isServiceSelected(serviceId: number): boolean {
    return this.servicesArray.value.includes(serviceId);
  }

  openRequestModal() {
    this.isRequestModal = true;
  }

  closeRequestModal() {
    this.isRequestModal = false;
  }

  sendOrderRequest() {
    if (this.orderForm.invalid) return;

    const formData = new FormData();

    formData.append('name', this.orderForm.value.name);

    formData.append(
      'deadline',
      new Date(this.orderForm.value.deadline).toISOString()
    );

    if (this.orderForm.value.notes) {
      formData.append('notes', this.orderForm.value.notes);
    }

    formData.append('services', JSON.stringify(this.servicesArray.value));

    this._LabService.createOrderRequest(this.labId, formData).subscribe({
      next: () => {
        this.closeRequestModal();
        this.orderForm.reset();
        this.servicesArray.clear();
        this._MatSnackBar.open('Order sent successfully', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
      error: () => {
        this._MatSnackBar.open('Failed to send order', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  backToLabs() {
    this.router.navigate(['/dashboard/labs/system']);
  }
}
