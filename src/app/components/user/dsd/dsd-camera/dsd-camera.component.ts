import { Component, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FaceLandmarkerService } from '../face-landmarker.service';
import { computeDentalLines, drawDentalLines, PROFILE_CONFIG } from '../landmarks';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dsd-camera',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './dsd-camera.component.html',
  styleUrl: './dsd-camera.component.scss'
})
export class DsdCameraComponent implements OnInit, OnDestroy {

  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasEl') canvasEl!: ElementRef<HTMLCanvasElement>;

  profileIndex = 0;
  profileId = '';
  guideText = '';

  private stream: MediaStream | null = null;
  private rafId = 0;

  // Store captured image to send back
  capturedImage: string | null = null;
  isCaptured = false;

  private readonly guides: Record<string, string> = {
    'Lateral Profile':    'Turn your face to the side',
    'Facial Profile':     'Look straight at the camera',
    'Smile Profile':      'Smile naturally at the camera',
    'Lateral Occlusion':  'Turn sideways, close your teeth',
    'Intraoral Lateral':  'Open wide, turn to the side',
    'Teeth Segmentation': 'Open wide, face the camera',
  };

  private readonly profileIds = [
    'Lateral Profile', 'Facial Profile', 'Smile Profile',
    'Lateral Occlusion', 'Intraoral Lateral', 'Teeth Segmentation'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private landmarkerService: FaceLandmarkerService
  ) {}

  async ngOnInit(): Promise<void> {
    // Get which card opened this camera
    this.profileIndex = Number(this.route.snapshot.paramMap.get('profileIndex') ?? 0);
    this.profileId = this.profileIds[this.profileIndex];
    this.guideText = this.guides[this.profileId] ?? 'Look at the camera';

    await this.startCamera();
  }

  async startCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      setTimeout(async () => {
        const video = this.videoEl.nativeElement;
        video.srcObject = this.stream!;
        await video.play();

        const landmarker = await this.landmarkerService.get();
        await this.landmarkerService.setMode('VIDEO');
        this.startLoop(video, landmarker);
      }, 100);

    } catch {
      alert('Cannot access camera.');
      this.goBack();
    }
  }

  private startLoop(video: HTMLVideoElement, landmarker: any): void {
    let lastTime = -1;

    const loop = () => {
      if (this.isCaptured) return; // stop loop after capture
      if (!video || video.paused) return;

      const canvas = this.canvasEl.nativeElement;
      const now = performance.now();
      if (now === lastTime) { this.rafId = requestAnimationFrame(loop); return; }
      lastTime = now;

      // Match canvas to displayed size
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      try {
        const results = landmarker.detectForVideo(video, now);
        if (results.faceLandmarks?.length > 0) {
          const lm = results.faceLandmarks[0];
          const lineLabels = PROFILE_CONFIG[this.profileId] ?? [];
          const allLines = computeDentalLines(lm, canvas.width, canvas.height);
          const filtered = allLines.filter(l => lineLabels.includes(l.label));
          drawDentalLines(ctx, filtered);
        }
      } catch { }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  // ── Capture photo — saves to localStorage to pass back ──
  capture(): void {
    const video = this.videoEl.nativeElement;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    const ctx = tempCanvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);
    this.capturedImage = tempCanvas.toDataURL('image/jpeg', 0.9);
    this.isCaptured = true;
    this.stopCamera();
  }

  // ── Confirm: save image and go back to DSD page ──
  confirm(): void {
    // Save captured image in localStorage keyed by profile index
    localStorage.setItem(`dsd_captured_${this.profileIndex}`, this.capturedImage!);
    this.router.navigate(['/dashboard/dsd']);
  }

  // ── Retake: restart camera ──
  retake(): void {
    this.capturedImage = null;
    this.isCaptured = false;
    this.startCamera();
  }

  goBack(): void {
    this.stopCamera();
    this.router.navigate(['/dashboard/dsd']);
  }

  private stopCamera(): void {
    cancelAnimationFrame(this.rafId);
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }
}