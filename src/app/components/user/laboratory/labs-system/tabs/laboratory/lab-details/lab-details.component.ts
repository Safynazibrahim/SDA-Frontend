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
    private _MatSnackBar: MatSnackBar,
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

    this.updateNotes();

    const formData = new FormData();

    formData.append('name', this.orderForm.value.name);

    formData.append(
      'deadline',
      new Date(this.orderForm.value.deadline).toISOString(),
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

  toothType: 'Anterior' | 'Premolar' | 'Molar' | null = null;
  showSummary = false;

  /* ==== OPTIONS (same idea as Flutter) ==== */
  /* ===== WHOLE TOOTH (Flutter-equivalent) ===== */
  toothOptions: Record<string, string[]> = {
    Contour: ['Flat', 'Convex', 'Concave', 'Bulky (Cervical)', 'Straight'],
    Contact: [
      'Tight',
      'Light',
      'Open (Diastema)',
      'Point Contact',
      'Surface Contact',
    ],
    'Stains/Effects': [
      'None',
      'White Spots',
      'Brown Stains',
      'Enamel Cracks',
      'Hypocalcification',
      'Mamelons',
    ],
    Texture: [
      'Smooth (High Gloss)',
      'Moderate (Natural)',
      'Heavy (Rugged)',
      'Horizontal Striations',
    ],
  };

  /* ===== SEGMENT OPTIONS (Flutter-equivalent) ===== */
  segmentOptions: Record<string, string[]> = {
    Shade: [
      'A1',
      'A2',
      'A3',
      'A3.5',
      'A4',
      'B1',
      'B2',
      'B3',
      'B4',
      'C1',
      'C2',
      'C3',
      'C4',
      'D2',
      'D3',
      'D4',
      'OM1',
      'OM2',
      'OM3',
    ],
    Translucency: [
      'High (HT)',
      'Medium (MT)',
      'Low (LT)',
      'Opaque (HO)',
      'Incisal Effect',
    ],
  };

  /* ===== Flutter-equivalent anatomy ===== */
  rows: string[] = [];
  cols: string[] = [];

  /* ===== STATE ===== */
  segments: Record<string, Record<string, string>> = {};
  wholeTooth: Record<string, string> = {};
  generatedNotes = '';

  /* ===== OPTIONS ===== */
  translucencyOptions = ['High', 'Medium', 'Low', 'Opaque'];

  /* ===== Tooth Type ===== */
  setToothType(type: 'Anterior' | 'Premolar' | 'Molar') {
    this.toothType = type;
    this.segments = {};
    this.showSummary = false;

    if (type === 'Anterior') {
      this.rows = ['Cervical', 'Middle', 'Incisal'];
      this.cols = ['Mesial', 'Central', 'Distal'];
    } else if (type === 'Premolar') {
      this.rows = ['Cervical', 'Middle', 'Occlusal'];
      this.cols = ['Buccal', 'Proximal', 'Lingual'];
    } else {
      this.rows = ['Cervical', 'Middle', 'Occlusal'];
      this.cols = ['Central Groove', 'Cuspal Slopes', 'Cusp Tips'];
    }
  }

  /* ==== WHOLE TOOTH ==== */
  setWholeTooth(key: string, value: string) {
    if (!value) return;
    this.wholeTooth[key] = value;
    this.updateNotes();
  }

  /* ===== EXACT Flutter segment ID ===== */
  getSegmentId(row: string, col: string): string {
    if (this.toothType === 'Molar') {
      const map: any = {
        'Central Groove': 'CG',
        'Cuspal Slopes': 'CS',
        'Cusp Tips': 'CT',
      };
      return `${row[0]}-${map[col]}`;
    }
    return `${row[0]}-${col[0]}`;
  }

  /* ===== Select / Unselect segment ===== */
  toggleSegment(row: string, col: string) {
    const id = this.getSegmentId(row, col);

    if (this.segments[id]) {
      delete this.segments[id];
    } else {
      this.segments[id] = {};
    }
  }

  /* ===== Set segment property ===== */
  setSegment(segmentId: string, key: string, value: string) {
    if (!value) return;
    this.segments[segmentId][key] = value;
  }

  /* ===== Save (review step like Flutter) ===== */
  saveSegments() {
    this.updateNotes();
    this.showSummary = true;
  }

  /* ===== Cancel ===== */
  cancelSegments() {
    this.segments = {};
    this.updateNotes();
  }

  /* ===== Notes generator (Flutter-style) ===== */
  updateNotes() {
    let text = '';

    text += `TOOTH TYPE: ${this.toothType}\n\n`;

    text += 'Segment Properties:\n';
    Object.entries(this.segments).forEach(([segment, props]) => {
      text += `[${segment}]: `;
      text += Object.entries(props)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      text += '\n';
    });

    this.generatedNotes = text;
    this.orderForm.patchValue({ notes: text });
  }

  /* ===== Helper ===== */
  get selectedSegments(): string[] {
    return Object.keys(this.segments);
  }
}
