import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dental-history',
  standalone: true,
  imports: [TranslateModule,MatDatepickerModule,
      MatFormFieldModule,
      MatInputModule,FormsModule,MatIconModule],
  templateUrl: './dental-history.component.html',
  styleUrl: './dental-history.component.scss'
})
export class DentalHistoryComponent {

  fromDate!: Date | null;
  toDate!: Date | null;

}
