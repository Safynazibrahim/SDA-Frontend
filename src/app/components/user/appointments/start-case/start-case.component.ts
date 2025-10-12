import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { WebSpeechService } from './speech-to-text.service';
@Component({
  selector: 'app-start-case',
  standalone: true,
  imports: [MatIcon, CommonModule, TranslateModule, FormsModule],
  templateUrl: './start-case.component.html',
  styleUrl: './start-case.component.scss'
})
export class StartCaseComponent implements OnDestroy{
  realChecked = false;
  xrayChecked = false;
  uploadedFiles: { name: string; preview: string }[] = [];
isRecording = false;
permissionDenied = false;
downloadFileName = '';
 selectedLang: 'ar' | 'en' = 'en';
  transcriptionResult = '';
constructor(private cdRef: ChangeDetectorRef , private speechService: WebSpeechService) {}

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


async toggleRecording() {
  if (this.isRecording) {
    // لو بيسجل دلوقتي → وقف الاستماع
    this.stopListening();
    this.isRecording = false;
    console.log('🛑 Listening stopped.');
  } else {
    // لو مش بيسجل → ابدأ الاستماع
    this.isRecording = true;
    this.transcriptionResult = 'Listening...';
    console.log('🎤 Listening started...');
    
    this.speechService.startListening(this.selectedLang, (text) => {
      this.transcriptionResult = text;
      this.cdRef.detectChanges();
    }, () => {
      console.log('Recognition finished');
      this.isRecording = false;
      this.cdRef.detectChanges();
    });
  }
}


private getSupportedMime(): string | undefined {
  const candidates = [
    'audio/mp4', // الأكثر دعمًا عبر المتصفحات
    'audio/mpeg', // mp3 fallback
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
    this.downloadFileName = `recording_${new Date()
  .toISOString()
  .replace(/[:.]/g, '-')}.mp4`;

  const blobType = 'audio/mp4';   // بدل webm
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
    this.timerRef = setInterval(() => this.seconds++, 1000);
  } catch {
    this.permissionDenied = true;
    this.isRecording = false;
    this.clearStream();
  }
}

// stopRecording() {
//   if (this.mediaRecorder && this.isRecording) {
//     this.mediaRecorder.stop();
//   }
//   this.isRecording = false;
//   if (this.timerRef) clearInterval(this.timerRef);
// }
stopRecording() {
  if (this.mediaRecorder && this.isRecording) {
    this.mediaRecorder.stop();
  }
  this.isRecording = false;
  if (this.timerRef) clearInterval(this.timerRef);
  // timer يفضل ظاهر بالرقم النهائي
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
//  async processAudio() {
//     if (!this.audioBlob) return;
    
//     // تحقق من الدعم أولاً
//     if (!this.speechService.isApiSupported()) {
//       this.transcriptionResult = 'Speech recognition not supported in this browser.';
//       this.cdRef.detectChanges();
//       return;
//     }

//     this.transcriptionResult = 'Processing...';
//     this.cdRef.detectChanges();

//     try {
//       const text = await this.speechService.transcribeBlob(
//         this.audioBlob, 
//         this.selectedLang
//       );
//       this.transcriptionResult = text || 'No speech detected.';
//       console.log('✅ Transcription result:', text);
//     } catch (e: any) {
//       console.error('❌ Error:', e);
//       this.transcriptionResult = `Error: ${e.message}`;
//     }
    
//     this.cdRef.detectChanges();
//   }
startListening() {
  this.transcriptionResult = 'Listening...';
  this.speechService.startListening(this.selectedLang, (text) => {
    this.transcriptionResult = text;
    this.cdRef.detectChanges();
  }, () => {
    console.log('Recognition finished');
  });
}

stopListening() {
  this.speechService.stopListening();
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
// import { CommonModule } from '@angular/common';
// import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
// import { MatIconModule } from '@angular/material/icon';
// import { TranslateModule } from '@ngx-translate/core';

// declare global {
//   interface Window {
//     webkitSpeechRecognition: any;
//     SpeechRecognition: any;
//   }

//   interface SpeechRecognition extends EventTarget {
//     continuous: boolean;
//     interimResults: boolean;
//     lang: string;
//     start(): void;
//     stop(): void;
//     onresult: ((event: SpeechRecognitionEvent) => void) | null;
//     onerror: ((event: any) => void) | null;
//     onend: (() => void) | null;
//   }

//   interface SpeechRecognitionEvent extends Event {
//     resultIndex: number;
//     results: SpeechRecognitionResultList;
//   }
// }

// @Component({
//   selector: 'app-start-case',
//   standalone: true,
//   imports: [CommonModule, MatIconModule, TranslateModule],
//   templateUrl: './start-case.component.html',
//   styleUrls: ['./start-case.component.scss'],
// })
// export class StartCaseComponent implements OnDestroy {
//   // Image Upload
//   realChecked = false;
//   xrayChecked = false;
//   uploadedFiles: { name: string; preview: string }[] = [];

//   // Recording
//   isRecording = false;
//   permissionDenied = false;
//   downloadFileName = '';
//   audioBlob: Blob | null = null;
//   audioUrl: string | null = null;

//   // Timer
//   private mediaStream: MediaStream | null = null;
//   private mediaRecorder?: MediaRecorder;
//   private chunks: Blob[] = [];
//   private timerRef?: any;
//   private seconds = 0;

//   // Speech Recognition
//   recognition: SpeechRecognition | null = null;
//   transcribedText = '';
//   isProcessing = false;
//   transcriptionError = '';

//   constructor(private cdRef: ChangeDetectorRef) {
//     this.initSpeechRecognition();
//   }

//   /** Time format (mm:ss) */
//   get formattedTime(): string {
//     const m = Math.floor(this.seconds / 60).toString().padStart(2, '0');
//     const s = (this.seconds % 60).toString().padStart(2, '0');
//     return `${m}:${s}`;
//   }

//  /** Initialize Web Speech API */
// private initSpeechRecognition() {
//   const SpeechRecognition =
//     window.SpeechRecognition || window.webkitSpeechRecognition;

//   if (SpeechRecognition) {
//     this.recognition = new SpeechRecognition();

//     this.recognition!.continuous = false;
//     this.recognition!.interimResults = false;
//     this.recognition!.lang = 'en-US'; // or 'ar-EG'

//     this.recognition!.onresult = (event: SpeechRecognitionEvent) => {
//       const transcript = event.results[0][0].transcript;
//       this.transcribedText = transcript;
//       this.cdRef.detectChanges();
//     };

//     this.recognition!.onerror = (event: any) => {
//       console.error('Speech recognition error:', event.error);
//       this.transcriptionError = 'Speech recognition failed.';
//     };
//   } else {
//     console.warn('SpeechRecognition API not supported.');
//   }
// }


//   /** Toggle start/stop recording */
//   async toggleRecording() {
//     if (this.isRecording) {
//       this.stopRecording();
//     } else {
//       await this.startRecording();
//     }
//   }

//   private getSupportedMime(): string | undefined {
//     const candidates = [
//       'audio/mp4',
//       'audio/mpeg',
//       'audio/webm;codecs=opus',
//       'audio/webm',
//     ];
//     return candidates.find((type) => MediaRecorder.isTypeSupported(type));
//   }

//   /** Start audio recording */
//   async startRecording() {
//     this.permissionDenied = false;
//     this.transcribedText = '';
//     try {
//       this.mediaStream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//       });
//       const mime = this.getSupportedMime();
//       this.mediaRecorder = new MediaRecorder(
//         this.mediaStream!,
//         mime ? { mimeType: mime } : undefined
//       );

//       this.chunks = [];
//       this.mediaRecorder.ondataavailable = (e) => {
//         if (e.data && e.data.size > 0) this.chunks.push(e.data);
//       };

//       this.mediaRecorder.onstop = () => {
//         this.downloadFileName = `recording_${new Date()
//           .toISOString()
//           .replace(/[:.]/g, '-')}.mp4`;

//         const blobType = 'audio/mp4';
//         this.audioBlob = new Blob(this.chunks, { type: blobType });
//         if (this.audioUrl) URL.revokeObjectURL(this.audioUrl);
//         this.audioUrl = URL.createObjectURL(this.audioBlob);

//         this.cdRef.detectChanges();
//         this.clearStream();
//       };

//       this.mediaRecorder.start();
//       this.isRecording = true;
//       this.seconds = 0;
//       this.timerRef = setInterval(() => this.seconds++, 1000);
//     } catch {
//       this.permissionDenied = true;
//       this.isRecording = false;
//       this.clearStream();
//     }
//   }

//   /** Stop recording */
//   stopRecording() {
//     if (this.mediaRecorder && this.isRecording) {
//       this.mediaRecorder.stop();
//     }
//     this.isRecording = false;
//     if (this.timerRef) clearInterval(this.timerRef);
//   }

//   /** Convert recorded audio to text */
// /** Convert recorded audio to text */
// async processAudio() {
//   if (!this.audioBlob) return;
//   this.isProcessing = true;
//   this.transcriptionError = '';

//   try {
//     if (this.recognition) {
//       // Stop first if it's already running
//       try {
//         this.recognition.stop();
//       } catch {}

//       // Wait briefly before restarting to avoid InvalidStateError
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       this.transcribedText = '';
//       this.recognition.start();
//     } else {
//       throw new Error('SpeechRecognition not available');
//     }
//   } catch (error) {
//     console.error('SpeechRecognition error:', error);
//     this.transcriptionError =
//       'Unable to start transcription. Make sure your browser supports SpeechRecognition.';
//   } finally {
//     this.isProcessing = false;
//     this.cdRef.detectChanges();
//   }
// }


//   private clearStream() {
//     if (this.mediaStream) {
//       this.mediaStream.getTracks().forEach((t) => t.stop());
//       this.mediaStream = null;
//     }
//   }

//   ngOnDestroy() {
//     if (this.timerRef) clearInterval(this.timerRef);
//     this.clearStream();
//     if (this.audioUrl) URL.revokeObjectURL(this.audioUrl);
//     if (this.recognition) this.recognition.stop();
//   }

//   // ================= Image Upload Logic ==================

//   get selectedImageLabel(): string {
//     if (this.realChecked && this.xrayChecked) return 'Real & X-Ray Images';
//     if (this.realChecked) return 'Real Images';
//     if (this.xrayChecked) return 'X-Ray Images';
//     return '';
//   }

//   onImageTypeChange(type: string, event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (type === 'real') this.realChecked = input.checked;
//     if (type === 'xray') this.xrayChecked = input.checked;

//     if (!this.realChecked && !this.xrayChecked) this.uploadedFiles = [];
//   }

//   onFilesSelected(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.uploadedFiles = [];
//       Array.from(input.files).forEach((file) => {
//         const reader = new FileReader();
//         reader.onload = (e: any) => {
//           this.uploadedFiles.push({
//             name: file.name,
//             preview: e.target.result,
//           });
//         };
//         reader.readAsDataURL(file);
//       });
//     }
//   }
// }
