import {
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FaceLandmarkerService } from './face-landmarker.service';
import {
  PROFILE_CONFIG,
  computeDentalLines,
  drawDentalLines,
} from './landmarks';
import { Router } from '@angular/router';
import { SmileDesignerComponent } from './smile-designer/smile-designer.component';
import { DentalAnalysisComponent } from './dental-analysis/dental-analysis.component';

// ── One profile card's state ──────────────────────────────────────────────────
interface ProfileState {
  id: string;
  imageUrl: string | null;
  mode: 'idle' | 'camera' | 'image';
  processing: boolean;
}

@Component({
  selector: 'app-dsd',
  standalone: true,
  imports: [CommonModule, TranslateModule, SmileDesignerComponent,DentalAnalysisComponent],
  templateUrl: './dsd.component.html',
  styleUrl: './dsd.component.scss',
})
export class DsdComponent implements OnDestroy {
  // ── Model loading state ─────────────────────────────────────────────────────
  modelReady = signal(false);
  modelLoading = signal(true);

  // ── 6 profile cards ─────────────────────────────────────────────────────────
  // Order matches PROFILE_CONFIG keys
  profiles: ProfileState[] = [
    { id: 'Lateral Profile', imageUrl: null, mode: 'idle', processing: false },
    { id: 'Facial Profile', imageUrl: null, mode: 'idle', processing: false },
    { id: 'Smile Profile', imageUrl: null, mode: 'idle', processing: false },
    {
      id: 'Lateral Occlusion',
      imageUrl: null,
      mode: 'idle',
      processing: false,
    },
    {
      id: 'Intraoral Lateral',
      imageUrl: null,
      mode: 'idle',
      processing: false,
    },
    {
      id: 'Teeth Segmentation',
      imageUrl: null,
      mode: 'idle',
      processing: false,
    },
  ];

  // ── ViewChild refs — one per card (indexed 0–5) ───────────────────────────
  // Video elements
  @ViewChild('video0') video0!: ElementRef<HTMLVideoElement>;
  @ViewChild('video1') video1!: ElementRef<HTMLVideoElement>;
  @ViewChild('video2') video2!: ElementRef<HTMLVideoElement>;
  @ViewChild('video3') video3!: ElementRef<HTMLVideoElement>;
  @ViewChild('video4') video4!: ElementRef<HTMLVideoElement>;
  @ViewChild('video5') video5!: ElementRef<HTMLVideoElement>;

  // Canvas elements
  @ViewChild('canvas0') canvas0!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas1') canvas1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2') canvas2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas3') canvas3!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas4') canvas4!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas5') canvas5!: ElementRef<HTMLCanvasElement>;

  // Image elements
  @ViewChild('img0') img0!: ElementRef<HTMLImageElement>;
  @ViewChild('img1') img1!: ElementRef<HTMLImageElement>;
  @ViewChild('img2') img2!: ElementRef<HTMLImageElement>;
  @ViewChild('img3') img3!: ElementRef<HTMLImageElement>;
  @ViewChild('img4') img4!: ElementRef<HTMLImageElement>;
  @ViewChild('img5') img5!: ElementRef<HTMLImageElement>;

  // File inputs
  @ViewChild('file0') file0!: ElementRef<HTMLInputElement>;
  @ViewChild('file1') file1!: ElementRef<HTMLInputElement>;
  @ViewChild('file2') file2!: ElementRef<HTMLInputElement>;
  @ViewChild('file3') file3!: ElementRef<HTMLInputElement>;
  @ViewChild('file4') file4!: ElementRef<HTMLInputElement>;
  @ViewChild('file5') file5!: ElementRef<HTMLInputElement>;

  // ── Animation frame & stream refs per card ───────────────────────────────
  private rafIds: number[] = [0, 0, 0, 0, 0, 0];
  private streams: (MediaStream | null)[] = [
    null,
    null,
    null,
    null,
    null,
    null,
  ];

  constructor(
    private landmarkerService: FaceLandmarkerService,
    private router: Router,
  ) {
    // Pre-load MediaPipe when component opens
    this.landmarkerService
      .get()
      .then(() => {
        this.modelReady.set(true);
        this.modelLoading.set(false);
      })
      .catch((err) => {
        console.error('MediaPipe load error:', err);
        this.modelLoading.set(false);
      });
  }

  // ── Helpers to get refs by index ─────────────────────────────────────────
  private getVideo(i: number): HTMLVideoElement {
    const refs = [
      this.video0,
      this.video1,
      this.video2,
      this.video3,
      this.video4,
      this.video5,
    ];
    return refs[i].nativeElement;
  }

  private getCanvas(i: number): HTMLCanvasElement {
    const refs = [
      this.canvas0,
      this.canvas1,
      this.canvas2,
      this.canvas3,
      this.canvas4,
      this.canvas5,
    ];
    return refs[i].nativeElement;
  }

  private getImg(i: number): HTMLImageElement {
    const refs = [
      this.img0,
      this.img1,
      this.img2,
      this.img3,
      this.img4,
      this.img5,
    ];
    return refs[i].nativeElement;
  }

  private getFileInput(i: number): HTMLInputElement {
    const refs = [
      this.file0,
      this.file1,
      this.file2,
      this.file3,
      this.file4,
      this.file5,
    ];
    return refs[i].nativeElement;
  }

  // ── LINE LABELS for each card (from PROFILE_CONFIG) ──────────────────────
  private getLineLabels(profileId: string): string[] {
    return PROFILE_CONFIG[profileId] ?? [];
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  DEVICE IMAGE — user picks a photo from their device
  // ══════════════════════════════════════════════════════════════════════════

  onDeviceImage(index: number): void {
    this.stopCamera(index); // stop camera if running
    this.getFileInput(index).click(); // open file picker
  }

  async onFileSelected(event: Event, index: number): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Show image
    const url = URL.createObjectURL(file);
    this.profiles[index].imageUrl = url;
    this.profiles[index].mode = 'image';

    // Wait for Angular to render the <img> tag, then process
    setTimeout(() => this.processImage(index), 100);
  }

  private async processImage(index: number): Promise<void> {
    this.profiles[index].processing = true;

    try {
      const landmarker = await this.landmarkerService.get();
      await this.landmarkerService.setMode('IMAGE');

      const img = this.getImg(index);
      const canvas = this.getCanvas(index);

      // ✅ Detect uses natural size
      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;

      // ✅ Canvas matches displayed size
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ✅ Detect on full resolution image
      const results = landmarker.detect(img);

      if (!results.faceLandmarks?.length) {
        alert('No face detected. Please try a clearer photo.');
        return;
      }

      const lm = results.faceLandmarks[0];
      const profileId = this.profiles[index].id;
      const lineLabels = this.getLineLabels(profileId);

      // ✅ Landmarks are 0→1 normalized so just multiply by DISPLAY size
      // This is correct — landmarks are already normalized 0-1
      // so canvas.width and canvas.height is correct here
      const allLines = computeDentalLines(lm, canvas.width, canvas.height);
      const filtered = allLines.filter((l) => lineLabels.includes(l.label));
      drawDentalLines(ctx, filtered);
    } catch (err) {
      console.error('Image processing error:', err);
    } finally {
      this.profiles[index].processing = false;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  LIVE CAMERA — real-time detection loop
  // ══════════════════════════════════════════════════════════════════════════

  onLiveCamera(index: number): void {
    window.open(`/dashboard/dsd-camera/${index}`, '_blank');
  }
  // async onLiveCamera(index: number): Promise<void> {
  //   // If camera already running for this card → stop it
  //   if (this.profiles[index].mode === 'camera') {
  //     this.stopCamera(index);
  //     this.profiles[index].mode = 'idle';
  //     return;
  //   }

  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
  //     });

  //     this.streams[index] = stream;
  //     this.profiles[index].mode = 'camera';
  //     this.profiles[index].imageUrl = null;

  //     // Wait for Angular to render <video>, then attach stream
  //     setTimeout(async () => {
  //       const video = this.getVideo(index);
  //       video.srcObject = stream;
  //       video.setAttribute('playsinline', 'true');
  //       await video.play();

  //       const landmarker = await this.landmarkerService.get();
  //       await this.landmarkerService.setMode('VIDEO');

  //       this.startCameraLoop(index, video, landmarker);
  //     }, 100);

  //   } catch (err) {
  //     console.error('Camera error:', err);
  //     alert('Cannot access camera. Please check permissions.');
  //   }
  // }

  private startCameraLoop(
    index: number,
    video: HTMLVideoElement,
    landmarker: any,
  ): void {
    let lastTime = -1;

    const loop = () => {
      if (!video || video.paused || video.ended) return;

      const canvas = this.getCanvas(index);
      const now = performance.now();

      if (now === lastTime) {
        this.rafIds[index] = requestAnimationFrame(loop);
        return;
      }
      lastTime = now;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      try {
        const results = landmarker.detectForVideo(video, now);
        if (results.faceLandmarks?.length > 0) {
          const lm = results.faceLandmarks[0];
          const profileId = this.profiles[index].id;
          const lineLabels = this.getLineLabels(profileId);

          const allLines = computeDentalLines(lm, canvas.width, canvas.height);
          const filtered = allLines.filter((l) => lineLabels.includes(l.label));
          drawDentalLines(ctx, filtered);
        }
      } catch {
        // skip bad frame
      }

      this.rafIds[index] = requestAnimationFrame(loop);
    };

    this.rafIds[index] = requestAnimationFrame(loop);
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  STOP / RESET
  // ══════════════════════════════════════════════════════════════════════════

  private stopCamera(index: number): void {
    cancelAnimationFrame(this.rafIds[index]);
    this.streams[index]?.getTracks().forEach((t) => t.stop());
    this.streams[index] = null;
  }

  resetCard(index: number): void {
    this.stopCamera(index);
    this.profiles[index].mode = 'idle';
    this.profiles[index].imageUrl = null;
    this.profiles[index].processing = false;

    // Clear canvas
    try {
      const canvas = this.getCanvas(index);
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    } catch {
      /* canvas not rendered yet */
    }
  }

  // ── Clean up all cameras when leaving the page ───────────────────────────
  ngOnDestroy(): void {
    for (let i = 0; i < 6; i++) {
      this.stopCamera(i);
    }
  }
}
