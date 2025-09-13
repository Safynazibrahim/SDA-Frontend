import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-operator-packages',
  standalone: true,
  imports: [CommonModule, TranslateModule , RouterLink , MatIconModule],
  templateUrl: './operator-packages.component.html',
  styleUrls: ['./operator-packages.component.scss']
})
export class OperatorPackagesComponent {

}
