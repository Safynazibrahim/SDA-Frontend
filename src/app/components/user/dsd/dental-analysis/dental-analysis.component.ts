import {
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

type ViewType = 'left' | 'front' | 'right';

@Component({
  selector: 'app-dental-analysis',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dental-analysis.component.html',
  styleUrl: './dental-analysis.component.scss',
})
export class DentalAnalysisComponent {

  @ViewChild('leftInput')  leftInput!:  ElementRef<HTMLInputElement>;
  @ViewChild('frontInput') frontInput!: ElementRef<HTMLInputElement>;
  @ViewChild('rightInput') rightInput!: ElementRef<HTMLInputElement>;

  // ── Images ───────────────────────────────────────────────────────────────
  images: Record<ViewType, string | null> = {
    left:  null,
    front: null,
    right: null,
  };

  files: Record<ViewType, File | null> = {
    left:  null,
    front: null,
    right: null,
  };

  analyzing = false;

  // ══════════════════════════════════════════════════════════════════════════
  //  UPLOAD
  // ══════════════════════════════════════════════════════════════════════════

  triggerUpload(view: ViewType): void {
    const map = {
      left:  this.leftInput,
      front: this.frontInput,
      right: this.rightInput,
    };
    map[view]?.nativeElement.click();
  }

  onFileSelected(event: Event, view: ViewType): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (this.images[view]) URL.revokeObjectURL(this.images[view]!);
    this.files[view]  = file;
    this.images[view] = URL.createObjectURL(file);
  }

  removeImage(view: ViewType, event: MouseEvent): void {
    event.stopPropagation();
    if (this.images[view]) URL.revokeObjectURL(this.images[view]!);
    this.images[view] = null;
    this.files[view]  = null;
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  ANALYZE — logic comes later
  // ══════════════════════════════════════════════════════════════════════════

  async onAnalyze(): Promise<void> {
    if (!this.files.front) return;
    this.analyzing = true;

    try {
      // TODO: add Gemini analysis logic here
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Analysis coming soon!');
    } catch (err) {
      console.error(err);
    } finally {
      this.analyzing = false;
    }
  }
}