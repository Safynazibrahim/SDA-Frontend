import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { WebSpeechService } from './web-speech.service';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
@Component({
  selector: 'app-start-case',
  standalone: true,
  imports: [MatIcon, CommonModule, TranslateModule, FormsModule, RouterLink ],
  templateUrl: './start-case.component.html',
  styleUrl: './start-case.component.scss',
})
export class StartCaseComponent implements OnInit,OnDestroy {
  realChecked = false;
  xrayChecked = false;
  uploadedFiles: { name: string; preview: string }[] = [];
  isRecording = false;
  permissionDenied = false;
  downloadFileName = '';
  selectedLang: 'ar' | 'en' = 'en';
  transcriptionResult = '';
  appointmentId: string | null = null;
  fromPage: any;
  constructor(
    private cdRef: ChangeDetectorRef,
    private speechService: WebSpeechService,
    private route : ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('id');
     this.fromPage = this.route.snapshot.queryParamMap.get('from')
  }
  private mediaStream: MediaStream | null = null;
  private mediaRecorder?: MediaRecorder;
  private chunks: Blob[] = [];
  private timerRef?: any;
  private seconds = 0;

  audioBlob: Blob | null = null;
  audioUrl: string | null = null;

  get formattedTime(): string {
    const m = Math.floor(this.seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (this.seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  async toggleRecording() {
  if (this.isRecording) {
    // المستخدم ضغط على Stop
    this.stopRecording();
    this.stopListening();
    this.isRecording = false;
  } else {
    // المستخدم ضغط على Record
    this.isRecording = true;
    this.transcriptionResult = 'Listening...';
    this.seconds = 0;

    // تشغيل التسجيل الفعلي
    await this.startRecording();

    // تشغيل التعرف على الكلام بالتوازي
    this.speechService.startListening(
      this.selectedLang,
      (text) => {
        this.transcriptionResult = text;
        this.cdRef.detectChanges();
      },
      () => {
        console.log('🎤 Listening ended (manual stop expected)');
      }
    );
  }
}


  private getSupportedMime(): string | undefined {
    const candidates = [
      'audio/mp4', 
      'audio/mpeg', 
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
    ];
    return candidates.find((type) => MediaRecorder.isTypeSupported(type));
  }

  async startRecording() {
    this.permissionDenied = false;
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mime = this.getSupportedMime();
      this.mediaRecorder = new MediaRecorder(
        this.mediaStream!,
        mime ? { mimeType: mime } : undefined
      );

      this.chunks = [];
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) this.chunks.push(e.data);
      };
      this.mediaRecorder.onstop = () => {
        this.downloadFileName = `recording_${new Date()
          .toISOString()
          .replace(/[:.]/g, '-')}.mp4`;

        const blobType = 'audio/mp4'; // بدل webm
        this.audioBlob = new Blob(this.chunks, { type: blobType });
        if (this.audioUrl) URL.revokeObjectURL(this.audioUrl);
        this.audioUrl = URL.createObjectURL(this.audioBlob);
        console.log('🎧 Blob type:', blobType, 'URL:', this.audioUrl);
        this.cdRef.detectChanges();
        this.clearStream();
      };
      this.mediaRecorder.start();
      this.isRecording = true;
      this.seconds = 0;
      this.timerRef = setInterval(() => {
  this.seconds++;
  this.cdRef.detectChanges(); // عشان يحدّث القيمة في الـ HTML
}, 1000);

    } catch {
      this.permissionDenied = true;
      this.isRecording = false;
      this.clearStream();
    }
  }
  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
    }
    this.isRecording = false;
    if (this.timerRef) clearInterval(this.timerRef);
  }

  // reRecord() {
  //   // مسح التسجيل الحالي وإعادة المحاولة
  //   this.audioBlob = null;
  //   if (this.audioUrl) {
  //     URL.revokeObjectURL(this.audioUrl);
  //     this.audioUrl = null;
  //   }
  //   this.seconds = 0;
  // }
  startListening() {
    this.transcriptionResult = 'Listening...';
    this.speechService.startListening(
      this.selectedLang,
      (text) => {
        this.transcriptionResult = text;
        this.cdRef.detectChanges();
      },
      () => {
        console.log('Recognition finished');
      }
    );
  }

  stopListening() {
    this.speechService.stopListening();
  }

  private clearStream() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
  }

  ngOnDestroy() {
    if (this.timerRef) clearInterval(this.timerRef);
    this.clearStream();
    if (this.audioUrl) URL.revokeObjectURL(this.audioUrl);
  }

  get selectedImageLabel(): string {
    if (this.realChecked && this.xrayChecked) return 'Real & X-Ray Images';
    if (this.realChecked) return 'Real Images';
    if (this.xrayChecked) return 'X-Ray Images';
    return '';
  }

  onImageTypeChange(type: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (type === 'real') this.realChecked = input.checked;
    if (type === 'xray') this.xrayChecked = input.checked;

    // reset if none selected
    if (!this.realChecked && !this.xrayChecked) this.uploadedFiles = [];
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFiles = [];
      Array.from(input.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedFiles.push({
            name: file.name,
            preview: e.target.result,
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

}
