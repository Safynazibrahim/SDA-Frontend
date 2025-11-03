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
  patientId: string | null = null;
  fromPage: any;
  chiefComplaintOptions = [
  { key: 'pain', label: 'Pain (tooth / jaw / TMJ)', selected: false },
  { key: 'swelling', label: 'Swelling (facial / gingival)', selected: false },
  { key: 'bleeding', label: 'Bleeding', selected: false },
  { key: 'sensitivity', label: 'Sensitivity (hot / cold / sweet)', selected: false },
  { key: 'esthetic', label: 'Esthetic concerns (discoloration / malalignment)', selected: false },
  { key: 'chewing', label: 'Difficulty chewing', selected: false },
  { key: 'broken', label: 'Broken tooth', selected: false },
  { key: 'routine', label: 'Routine check-up / No complaint', selected: false },
];
natureOfComplaintOptions = [
  { key: 'sharp', label: 'Sharp', selected: false },
  { key: 'dull', label: 'Dull / Aching', selected: false },
  { key: 'throbbing', label: 'Throbbing / Intermittent', selected: false },
  { key: 'burning', label: 'Burning', selected: false },
  { key: 'pressure', label: 'Pressure sensation', selected: false },
];

aggravatingFactorsOptions = [
  { key: 'hot', label: 'Hot', selected: false },
  { key: 'cold', label: 'Cold', selected: false },
  { key: 'chewing', label: 'Chewing / Biting', selected: false },
  { key: 'lying', label: 'Lying down / Nighttime', selected: false },
  { key: 'none', label: 'No specific factor', selected: false },
];

medicalHistoryOptions = [
  { key: 'diabetes', label: 'Diabetes (Type 1 / Type 2 – Controlled / Uncontrolled)', selected: false },
  { key: 'cardio', label: 'Cardiovascular disease / Hypertension', selected: false },
  { key: 'asthma', label: 'Asthma / COPD', selected: false },
  { key: 'kidney', label: 'Kidney / Liver disease', selected: false },
  { key: 'autoimmune', label: 'Autoimmune disorders (Lupus, Rheumatoid Arthritis)', selected: false },
  { key: 'none', label: 'None', selected: false },
];
medicationsOfConcernOptions = [
  { key: 'anticoagulants', label: 'Anticoagulants (Warfarin)', selected: false },
  { key: 'bisphosphonates', label: 'Bisphosphonates', selected: false },
  { key: 'immunosuppressants', label: 'Immunosuppressants', selected: false },
  { key: 'gingival', label: 'Drugs causing gingival overgrowth', selected: false },
  { key: 'none', label: 'None', selected: false },
];

facialSymmetryOptions = [
  { key: 'symmetrical', label: 'Symmetrical (Normal)', selected: false },
  { key: 'asymmetrical', label: 'Asymmetrical (specify location & cause)', selected: false },
  { key: 'paralysis', label: 'Facial paralysis', selected: false },
  { key: 'swelling', label: 'Unilateral swelling', selected: false },
];

facialProfileOptions = [
  { key: 'straight', label: 'Straight (Orthognathic – Class I)', selected: false },
  { key: 'convex', label: 'Convex (Class II)', selected: false },
  { key: 'concave', label: 'Concave (Class III)', selected: false },
];

lymphNodesOptions = [
  { key: 'nonpalpable', label: 'Non-palpable (Normal)', selected: false },
  { key: 'palpable', label: 'Palpable (specify: soft / firm-fixed / tender / nodular)', selected: false },
];

tmjSoundsOptions = [
  { key: 'none', label: 'No sounds', selected: false },
  { key: 'clicking', label: 'Clicking (Early / Late)', selected: false },
  { key: 'popping', label: 'Popping', selected: false },
  { key: 'crepitus', label: 'Crepitus (Grinding)', selected: false },
];

tmjOpeningOptions = [
  { key: 'normal', label: 'Normal opening (40–50 mm)', selected: false },
  { key: 'limited', label: 'Limited opening (<35 mm)', selected: false },
  { key: 'deviation', label: 'Deviation to right / left', selected: false },
  { key: 'shape', label: 'S-shape or C-shape movement', selected: false },
];
private sectionMap = [
  { keywords: ['chief complaint', 'complaint'], handler: 'analyzeSpeechForChiefComplaint' },
  { keywords: ['nature of complaint', 'nature'], handler: 'analyzeSpeechForNatureOfComplaint' },
  { keywords: ['aggravating factors', 'factor'], handler: 'analyzeSpeechForAggravatingFactors' },
  { keywords: ['medical history', 'history'], handler: 'analyzeSpeechForMedicalHistory' },
  { keywords: ['medication history', 'medication'], handler: 'analyzeSpeechForMedicationsOfConcern' },
  { keywords: ['facial symmetry', 'symmetry'], handler: 'analyzeSpeechForFacialSymmetry' },
  { keywords: ['facial profile', 'profile'], handler: 'analyzeSpeechForFacialProfile' },
  { keywords: ['lymph nodes', 'lymph'], handler: 'analyzeSpeechForLymphNodes' },
  { keywords: ['tmj sounds', 'sound'], handler: 'analyzeSpeechForTMJSounds' },
  { keywords: ['tmj opening', 'opening'], handler: 'analyzeSpeechForTMJOpening' },
];

  constructor(
    private cdRef: ChangeDetectorRef,
    private speechService: WebSpeechService,
    private route : ActivatedRoute,
    private _Router:Router
  ) {}
  ngOnInit(): void {
    this.fromPage = this.route.snapshot.queryParamMap.get('from');
    if (this.fromPage === 'appointments') {
      this.appointmentId = this.route.snapshot.paramMap.get('id');
    console.log('🩺 Coming from Appointments');
    console.log('Appointment ID:', this.appointmentId);
  } else if (this.fromPage === 'patient-profile') {
    this.patientId = this.route.snapshot.paramMap.get('id');
    console.log('👤 Coming from Patient Profile');
    console.log('Patient ID:', this.patientId);
  } else {
    console.log('⚠️ Unknown source, default to appointments');
  }
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
        this.analyzeSpeechWithContext(text);


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

      this.analyzeSpeechWithContext(text);


      this.cdRef.detectChanges();
    },
    () => {
      console.log('Recognition finished');
    }
  );
}

analyzeSpeechForChiefComplaint(transcript: string) {
  const lowerText = transcript.toLowerCase();

  const keywordMap: { [key: string]: string[] } = {
    pain: ['pain', 'toothache', 'ache', 'jaw pain', 'tmj'],
    swelling: ['swelling', 'puffy', 'inflamed'],
    bleeding: ['bleeding', 'blood'],
    sensitivity: ['sensitive', 'hot', 'cold', 'sweet'],
    esthetic: ['color', 'discoloration', 'alignment', 'look', 'esthetic'],
    chewing: ['chew', 'chewing', 'bite'],
    broken: ['broken', 'fracture', 'crack'],
    routine: ['checkup', 'routine', 'no complaint', 'normal'],
  };

  this.chiefComplaintOptions.forEach(opt => {
    opt.selected = false; // reset
    for (const kw of keywordMap[opt.key]) {
      if (lowerText.includes(kw)) {
        opt.selected = true;
        break;
      }
    }
  });
}
analyzeSpeechForNatureOfComplaint(transcript: string) {
  const lowerText = transcript.toLowerCase();

  const map: Record<string, string[]> = {
    sharp: ['sharp', 'sting', 'knife'],
    dull: ['dull', 'aching', 'ache'],
    throbbing: ['throbbing', 'pulse', 'pulsing', 'intermittent'],
    burning: ['burning', 'hot pain', 'burns'],
    pressure: ['pressure', 'heavy', 'tight'],
  };

  this.natureOfComplaintOptions.forEach(opt => {
    const keywords = map[opt.key] ?? [];
    opt.selected = keywords.some(k => lowerText.includes(k));
  });
}


analyzeSpeechForAggravatingFactors(transcript: string) {
  const lowerText = transcript.toLowerCase();

  const map: Record<string, string[]> = {
    hot: ['hot', 'heat', 'warm'],
    cold: ['cold', 'ice', 'chilly'],
    chewing: ['chewing', 'biting', 'eat'],
    lying: ['lying', 'sleeping', 'night'],
    none: ['none', 'no factor', 'nothing'],
  };

  this.aggravatingFactorsOptions.forEach(opt => {
    const keywords = map[opt.key] ?? [];
    opt.selected = keywords.some(k => lowerText.includes(k));
  });
}


analyzeSpeechForMedicalHistory(transcript: string) {
  const lowerText = transcript.toLowerCase();

  const map: Record<string, string[]> = {
    diabetes: ['diabetes', 'sugar', 'insulin'],
    cardio: ['heart', 'hypertension', 'blood pressure', 'cardio'],
    asthma: ['asthma', 'copd', 'breathing'],
    kidney: ['kidney', 'liver'],
    autoimmune: ['lupus', 'rheumatoid', 'arthritis', 'immune'],
    none: ['none', 'no history', 'healthy'],
  };

  this.medicalHistoryOptions.forEach(opt => {
    const keywords = map[opt.key] ?? [];
    opt.selected = keywords.some(k => lowerText.includes(k));
  });
}
analyzeSpeechForMedicationsOfConcern(transcript: string) {
  const lowerText = transcript.toLowerCase();

  const map: Record<string, string[]> = {
    anticoagulants: ['warfarin', 'anticoagulant', 'blood thinner'],
    bisphosphonates: ['bisphosphonate', 'bone drug', 'osteoporosis medicine'],
    immunosuppressants: ['immunosuppressant', 'steroids', 'prednisone', 'cyclosporine'],
    gingival: ['gingival', 'gum overgrowth', 'phenytoin', 'nifedipine'],
    none: ['none', 'no medication', 'nothing'],
  };

  this.medicationsOfConcernOptions.forEach(opt => {
    const keywords = map[opt.key] ?? [];
    opt.selected = keywords.some(k => lowerText.includes(k));
  });
}
analyzeSpeechForFacialSymmetry(transcript: string) {
  const lowerText = transcript.toLowerCase();

  const map: Record<string, string[]> = {
    symmetrical: ['normal face', 'symmetrical', 'balanced'],
    asymmetrical: ['asymmetrical', 'uneven', 'not equal', 'deformity'],
    paralysis: ['paralysis', 'paralyzed', 'facial palsy'],
    swelling: ['unilateral swelling', 'swelling on one side', 'puffed side'],
  };

  this.facialSymmetryOptions.forEach(opt => {
    const keywords = map[opt.key] ?? [];
    opt.selected = keywords.some(k => lowerText.includes(k));
  });
}
analyzeSpeechForFacialProfile(transcript: string) {
  const lowerText = transcript.toLowerCase();

  const map: Record<string, string[]> = {
    straight: ['straight profile', 'normal profile', 'class one'],
    convex: ['convex', 'class two', 'protruded'],
    concave: ['concave', 'class three', 'receded'],
  };

  this.facialProfileOptions.forEach(opt => {
    const keywords = map[opt.key] ?? [];
    opt.selected = keywords.some(k => lowerText.includes(k));
  });
}
analyzeSpeechForLymphNodes(transcript: string) {
  const lowerText = transcript.toLowerCase();

  const map: Record<string, string[]> = {
    nonpalpable: ['normal lymph', 'non palpable', 'not felt'],
    palpable: ['palpable', 'tender node', 'swollen node', 'enlarged gland'],
  };

  this.lymphNodesOptions.forEach(opt => {
    const keywords = map[opt.key] ?? [];
    opt.selected = keywords.some(k => lowerText.includes(k));
  });
}
analyzeSpeechForTMJSounds(transcript: string) {
  const lowerText = transcript.toLowerCase();

  const map: Record<string, string[]> = {
    none: ['no sound', 'quiet joint', 'silent'],
    clicking: ['click', 'clicking', 'pop sound'],
    popping: ['popping', 'pop', 'snap'],
    crepitus: ['crepitus', 'grinding', 'rough sound'],
  };

  this.tmjSoundsOptions.forEach(opt => {
    const keywords = map[opt.key] ?? [];
    opt.selected = keywords.some(k => lowerText.includes(k));
  });
}
analyzeSpeechForTMJOpening(transcript: string) {
  const lowerText = transcript.toLowerCase();

  const map: Record<string, string[]> = {
    normal: ['normal opening', 'opens fine', 'good movement'],
    limited: ['limited', 'cannot open', 'restricted'],
    deviation: ['deviation', 'shift right', 'shift left'],
    shape: ['s shape', 'c shape', 'curve', 'crooked movement'],
  };

  this.tmjOpeningOptions.forEach(opt => {
    const keywords = map[opt.key] ?? [];
    opt.selected = keywords.some(k => lowerText.includes(k));
  });
}

private currentSection: string | null = null;

private analyzeSpeechWithContext(transcript: string) {
  const lower = transcript.toLowerCase();

  // 🧠 نحلل كل قسم بناءً على الكلمات المفتاحية
  const words = lower.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // ⛳ لو الكلمة بتنتمي لقسم جديد
    const matchedSection = this.sectionMap.find(section =>
      section.keywords.some(k => word.includes(k))
    );

    if (matchedSection) {
      // 🔄 بدّل للسياق الجديد
      this.currentSection = matchedSection.handler;
      console.log('📍 Switched to:', this.currentSection);
      continue;
    }

    // 🧩 لو إحنا في قسم حالي، حلّل الكلمة عليه
    if (this.currentSection) {
      const fn = (this as any)[this.currentSection];
      if (typeof fn === 'function') fn.call(this, word);
    } else {
      // fallback أول مرة بس
      this.analyzeSpeechForChiefComplaint(word);
      this.analyzeSpeechForMedicalHistory(word);
      this.analyzeSpeechForMedicationsOfConcern(word);
    }
  }
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

  goBackToPatoentProfile(){
  this._Router.navigate([`dashboard/patients/${this.patientId}/appointment-history`])
  }
  
  aiLink(): any[] {
  if (this.fromPage === 'patient-profile') {
    return ['/dashboard/patients/start-case/generate-ai', this.patientId];
  }
  return ['/dashboard/appointments/generate-ai', this.appointmentId];
}

  manualLink(): any[] {
  if (this.fromPage === 'patient-profile') {
    return ['/dashboard/patients/start-case/manual-diagnosis', this.patientId];
  }
  return ['/dashboard/appointments/manual-diagnosis', this.appointmentId];
}


}
