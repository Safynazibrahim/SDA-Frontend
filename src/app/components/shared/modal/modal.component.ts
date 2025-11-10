import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }


  @HostListener('document:keydown.escape', ['$event'])
onEscapeKey(event: Event) {
  if (event instanceof KeyboardEvent && this.isOpen) {
    this.onClose();
  }
}

}
