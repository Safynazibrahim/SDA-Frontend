import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-start-case',
  standalone: true,
  imports: [MatIcon, CommonModule, TranslateModule],
  templateUrl: './start-case.component.html',
  styleUrl: './start-case.component.scss'
})
export class StartCaseComponent implements OnDestroy{
  realChecked = false;
  xrayChecked = false;
  uploadedFiles: { name: string; preview: string }[] = [];
isRecording = false;
permissionDenied = false;

private mediaStream: MediaStream | null = null;
private mediaRecorder?: MediaRecorder;
private chunks: Blob[] = [];
private timerRef?: any;
private seconds = 0;

audioBlob: Blob | null = null;
audioUrl: string | null = null;

get formattedTime(): string {
  const m = Math.floor(this.seconds / 60).toString().padStart(2, '0');
  const s = (this.seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
get downloadFileName() {
  return `recording_${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
}

async toggleRecording() {
  if (this.isRecording) {
    this.stopRecording();
  } else {
    await this.startRecording();
  }
}

private getSupportedMime(): string | undefined {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4', // لبعض Safari
  ];
  return candidates.find(type => MediaRecorder.isTypeSupported(type));
}

async startRecording() {
  this.permissionDenied = false;
  try {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mime = this.getSupportedMime();
    this.mediaRecorder = new MediaRecorder(this.mediaStream!, mime ? { mimeType: mime } : undefined);

    this.chunks = [];
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) this.chunks.push(e.data);
    };
    this.mediaRecorder.onstop = () => {
      this.audioBlob = new Blob(this.chunks, { type: this.mediaRecorder?.mimeType || 'audio/webm' });
      if (this.audioUrl) URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = URL.createObjectURL(this.audioBlob);
      this.clearStream();
    };

    this.mediaRecorder.start();
    this.isRecording = true;
    this.seconds = 0;
    this.timerRef = setInterval(() => this.seconds++, 1000);
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

reRecord() {
  // مسح التسجيل الحالي وإعادة المحاولة
  this.audioBlob = null;
  if (this.audioUrl) {
    URL.revokeObjectURL(this.audioUrl);
    this.audioUrl = null;
  }
  this.seconds = 0;
}

private clearStream() {
  if (this.mediaStream) {
    this.mediaStream.getTracks().forEach(t => t.stop());
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
