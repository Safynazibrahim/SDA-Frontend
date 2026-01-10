import { Component, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LabService } from '../../../lab.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-expences',
  standalone: true,
  imports: [MatIcon, TranslateModule],
  templateUrl: './expences.component.html',
  styleUrl: './expences.component.scss',
})
export class ExpencesComponent implements OnInit {
  // =====================
  // DATA
  // =====================
  total = signal(0);
  loading = signal(false);

  constructor(private _LabService: LabService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.loading.set(true);

    this._LabService
      .getExpenses()
      .then((res) => {
        this.total.set(res.total);
      })
      .finally(() => this.loading.set(false));
  }
}
