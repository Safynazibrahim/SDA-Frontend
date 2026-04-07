import {
  Component,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-smile-designer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './smile-designer.component.html',
  styleUrl: './smile-designer.component.scss',
})
export class SmileDesignerComponent {

  @ViewChild('beforeInput') beforeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('sliderContainer') sliderContainer!: ElementRef<HTMLDivElement>;

  // ── Images ───────────────────────────────────────────────────────────────
  beforeUrl: string | null = null;
  beforeFile: File | null = null;
  afterUrl: string | null = null;

  // ── View mode ────────────────────────────────────────────────────────────
  viewMode: 'slider' | 'toggle' = 'slider';
  showingAfter = false;
  sliderPos = 50;
  private isDragging = false;

  // ── Treatments — same keys as Flutter dev ────────────────────────────────
  treatments: string[] = [
    'missing-tooth',
    'teeth-straightening',
    'gum-treatment',
    'lip-fix',
    'orthodontics',
    'full-dentures',
    'whitening',
    'remove-visible-caries',
  ];
  selectedTreatments: string[] = [];

  // ── Generate state ───────────────────────────────────────────────────────
  generating = false;
  errorMessage: string | null = null;

  // ══════════════════════════════════════════════════════════════════════════
  //  UPLOAD
  // ══════════════════════════════════════════════════════════════════════════

  triggerBeforeUpload(): void {
    this.beforeInput?.nativeElement.click();
  }

  onBeforeSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (this.beforeUrl) URL.revokeObjectURL(this.beforeUrl);
    this.beforeFile = file;
    this.beforeUrl = URL.createObjectURL(file);
    this.afterUrl = null;
    this.showingAfter = false;
    this.sliderPos = 50;
    this.errorMessage = null;
  }

  removeBefore(event: MouseEvent): void {
    event.stopPropagation();
    if (this.beforeUrl) URL.revokeObjectURL(this.beforeUrl);
    this.beforeUrl = null;
    this.beforeFile = null;
    this.afterUrl = null;
    this.showingAfter = false;
    this.errorMessage = null;
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  VIEW MODE
  // ══════════════════════════════════════════════════════════════════════════

  switchMode(): void {
    this.viewMode = this.viewMode === 'slider' ? 'toggle' : 'slider';
    this.showingAfter = false;
  }

  toggleImage(): void {
    if (!this.afterUrl) return;
    this.showingAfter = !this.showingAfter;
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  SLIDER — Mouse
  // ══════════════════════════════════════════════════════════════════════════

  startDrag(event: MouseEvent): void {
    this.isDragging = true;
    this.updateSlider(event.clientX);
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    this.updateSlider(event.clientX);
  }

  @HostListener('document:mouseup')
  onMouseUp(): void { this.isDragging = false; }

  // ══════════════════════════════════════════════════════════════════════════
  //  SLIDER — Touch
  // ══════════════════════════════════════════════════════════════════════════

  startDragTouch(event: TouchEvent): void {
    this.isDragging = true;
    this.updateSlider(event.touches[0].clientX);
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging) return;
    this.updateSlider(event.touches[0].clientX);
  }

  @HostListener('document:touchend')
  onTouchEnd(): void { this.isDragging = false; }

  private updateSlider(clientX: number): void {
    const container = this.sliderContainer?.nativeElement;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    this.sliderPos = Math.max(2, Math.min(98, pos));
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  TREATMENTS
  // ══════════════════════════════════════════════════════════════════════════

  toggleTreatment(t: string): void {
    if (this.selectedTreatments.includes(t)) {
      this.selectedTreatments = this.selectedTreatments.filter(x => x !== t);
    } else {
      this.selectedTreatments = [...this.selectedTreatments, t];
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  BUILD TREATMENT PROMPT — same as Flutter dev _buildTreatmentPrompt
  // ══════════════════════════════════════════════════════════════════════════

  private buildTreatmentPrompt(treatments: string[]): string {
    if (treatments.length === 0) {
      return `Perform a comprehensive digital smile makeover.
Enhance tooth color, alignment, gingival symmetry, and overall smile harmony
while preserving natural facial proportions, anatomical correctness, and realistic lighting.`;
    }

    const treatmentMap: Record<string, string> = {
      'whitening': `Perform professional dental bleaching.
Achieve a bright shade close to B1 on the VITA shade guide.
Preserve natural enamel translucency, surface texture, and light reflection.
Avoid over-whitening and maintain realistic gradients.`,

      'teeth-straightening': `Correct dental crowding, spacing, and misalignment.
Apply realistic orthodontic movement to align teeth properly.
Ensure symmetry between upper and lower arches and maintain a natural dental midline.`,

      'gum-treatment': `Perform gingival contouring and gingivectomy if needed.
Level gingival margins to create symmetry across anterior teeth.
Ensure healthy coral-pink gingiva with natural scalloping and proper tooth proportions.`,

      'lip-fix': `Enhance lip symmetry and dynamics.
Adjust lip contour and vermilion borders for better tooth display.
Ensure the smile arc follows the curvature of the lower lip naturally.`,

      'orthodontics': `Simulate the appearance during orthodontic treatment.
Teeth should appear partially aligned but still under correction.
Maintain realistic intermediate positioning without achieving final perfection.`,

      'full-dentures': `Perform full-arch rehabilitation using complete dentures.
Replace missing teeth with anatomically correct prosthetics.
Ensure natural gingival appearance, proper tooth size, alignment, and facial support.`,

      'remove-visible-caries': `Remove visible carious lesions digitally.
Restore affected areas with tooth-colored composite restorations.
Match surrounding enamel in color, texture, and reflectivity seamlessly.`,

      'missing-tooth': `Restore missing teeth using dental implants or fixed bridges.
Fill edentulous spaces with anatomically accurate crowns.
Ensure proper emergence profile, gingival integration, and alignment with adjacent teeth.`,
    };

    return treatments
      .map(t => treatmentMap[t] ?? t.replace(/-/g, ' '))
      .join('\n\n---\n\n');
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  GENERATE — same as Flutter dev generateDentalAfter
  // ══════════════════════════════════════════════════════════════════════════

  async onGenerate(): Promise<void> {
    if (!this.beforeFile || this.selectedTreatments.length === 0) return;

    this.generating = true;
    this.afterUrl = null;
    this.errorMessage = null;

    try {
      this.afterUrl = await this.generateDentalAfter(
        this.beforeFile,
        this.selectedTreatments
      );
      this.showingAfter = true;
      this.sliderPos = 50;
    } catch (err: any) {
      console.error('❌ Generate error:', err);
      this.errorMessage = err.message;
    } finally {
      this.generating = false;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  GEMINI API — exactly same logic as Flutter dev
  // ══════════════════════════════════════════════════════════════════════════

  private async generateDentalAfter(
    imageFile: File,
    treatments: string[]
  ): Promise<string> {

    // ── Step 1: Resize image to 1024px (same as Flutter dev) ────────────
    const bitmap = await createImageBitmap(imageFile);
    const canvas = document.createElement('canvas');
    const maxDim = 1024;
    const scale  = Math.min(maxDim / bitmap.width, maxDim / bitmap.height, 1);
    canvas.width  = Math.round(bitmap.width  * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];

    console.log(`📸 Processed image: ${canvas.width}x${canvas.height}`);

    // ── Step 2: Build treatment prompt (same as Flutter _buildTreatmentPrompt) ──
    const treatmentDesc = this.buildTreatmentPrompt(treatments);

    // ── Step 3: Build full prompt (same as Flutter) ──────────────────────
    const prompt = `ACT AS: Expert Digital Smile Designer & Clinical Prosthodontist.
TASK: Selective Dental In-painting.

[REQUIRED TREATMENT]:
${treatmentDesc}

[STRICT NEGATIVE CONSTRAINTS - DO NOT TOUCH]:
- If there is caries/decay present and it is NOT mentioned in the treatment, KEEP IT EXACTLY AS IS.
- Do NOT whiten the teeth unless explicitly requested.
- Do NOT straighten the teeth unless explicitly requested.
- Keep all existing dental defects, stains, and misalignments UNCHANGED unless they are part of the [REQUIRED TREATMENT].

[EXECUTION RULES]:
1. IDENTITY: Face, lips, and skin must be 100% identical to the original.
2. PRECISION: Only modify the specific teeth or gum areas required for the ${treatmentDesc}.
3. REALISM: Maintain the same lighting, shadows, and natural tooth texture of the original image.
4. OUTPUT: Return ONLY the modified image.`;

    // ── Step 4: Call Gemini API (same model as Flutter dev) ──────────────
    const apiKey = environment.geminiApiKey;
    const model  = 'gemini-3.1-flash-image-preview'; // same as Flutter dev
    const url    = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            { text: prompt },
            { inline_data: { mime_type: 'image/jpeg', data: base64Image } },
          ],
        }],
        generationConfig: {
          temperature: 0.2,
          response_modalities: ['IMAGE'],
        },
        // same safetySettings as Flutter dev
        safetySettings: [
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
        ],
      }),
    });

    // ── Step 5: Deep validation (same as Flutter dev) ────────────────────
    const data = await response.json();

    // 1. Explicit error check
    if (data == null) throw new Error('Server returned empty body');
    if (data.error) throw new Error(`Google API Error: ${data.error.message}`);

    // 2. Safety block check
    if (data.promptFeedback?.blockReason)
      throw new Error(`Blocked by Safety: ${data.promptFeedback.blockReason}`);

    // 3. Candidates check
    const candidates = data.candidates;
    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
      console.log('🔍 Full Debug Data:', JSON.stringify(data));
      throw new Error(
        `No candidates returned. Possible Finish Reason: ${candidates?.[0]?.finishReason}`
      );
    }

    const content = candidates[0].content;
    if (!content || !content.parts)
      throw new Error('Candidate has no content or parts');

    const parts = content.parts as any[];

    // 4. Extract image from parts
    for (const part of parts) {
      const inlineData = part.inline_data ?? part.inlineData;
      if (inlineData?.data) {
        const mimeType = inlineData.mime_type ?? inlineData.mimeType ?? 'image/png';
        console.log(`✅ AI Result Received. MimeType: ${mimeType}`);
        return `data:${mimeType};base64,${inlineData.data}`;
      }
    }

    // 5. Model refused with text
    if (parts.length > 0 && parts[0].text)
      throw new Error(`Model refused image generation: ${parts[0].text}`);

    throw new Error('No image data found in response');
  }
}