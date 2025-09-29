import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, TranslateModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @Input() placeholder: string = 'Search...'; // dynamic placeholder
  @Input() model: string = '';                // binded search text
  @Output() modelChange = new EventEmitter<string>(); 
  @Output() search = new EventEmitter<void>(); // when user clicks button or presses Enter

  onEnter() {
    this.search.emit();
  }

  onClick() {
    this.search.emit();
  }

  onInputChange(value: string) {
    this.model = value;
    this.modelChange.emit(value); // two-way binding support [(model)]
  }
}
