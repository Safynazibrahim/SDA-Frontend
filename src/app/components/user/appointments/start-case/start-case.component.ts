import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { WebSpeechService } from './web-speech.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StartCaseStateService } from './start-case-state.service';
import { CaseStateService } from '../assign-case/case-state.service';

@Component({
  selector: 'app-start-case',
  standalone: true,
  imports: [MatIcon, CommonModule, TranslateModule, FormsModule, RouterLink],
  templateUrl: './start-case.component.html',
  styleUrl: './start-case.component.scss',
})
export class StartCaseComponent implements OnInit, OnDestroy {
  realChecked = false;
  xrayChecked = false;
  uploadedFiles: { name: string; preview: string; file: File }[] = [];
  isRecording = false;
  permissionDenied = false;
  downloadFileName = '';
  selectedLang: 'ar' | 'en' = 'en';
  transcriptionResult = '';
  appointmentId: string | null = null;
  patientId: string | null = null;
  fromPage: any;
  chiefComplaint = '';
  chiefComplaintOptions = [
    { key: 'pain', label: 'Pain (tooth / jaw / TMJ)', selected: false },
    { key: 'swelling', label: 'Swelling (facial / gingival)', selected: false },
    { key: 'bleeding', label: 'Bleeding', selected: false },
    {
      key: 'sensitivity',
      label: 'Sensitivity (hot / cold / sweet)',
      selected: false,
    },
    {
      key: 'esthetic',
      label: 'Esthetic concerns (discoloration / malalignment)',
      selected: false,
    },
    { key: 'chewing', label: 'Difficulty chewing', selected: false },
    { key: 'broken', label: 'Broken tooth', selected: false },
    {
      key: 'routine',
      label: 'Routine check-up / No complaint',
      selected: false,
    },
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
    {
      key: 'diabetes',
      label: 'Diabetes (Type 1 / Type 2 – Controlled / Uncontrolled)',
      selected: false,
    },
    {
      key: 'cardio',
      label: 'Cardiovascular disease / Hypertension',
      selected: false,
    },
    { key: 'asthma', label: 'Asthma / COPD', selected: false },
    { key: 'kidney', label: 'Kidney / Liver disease', selected: false },
    {
      key: 'autoimmune',
      label: 'Autoimmune disorders (Lupus, Rheumatoid Arthritis)',
      selected: false,
    },
    { key: 'none', label: 'None', selected: false },
  ];

  medicationsOfConcernOptions = [
    {
      key: 'anticoagulants',
      label: 'Anticoagulants (Warfarin)',
      selected: false,
    },
    { key: 'bisphosphonates', label: 'Bisphosphonates', selected: false },
    { key: 'immunosuppressants', label: 'Immunosuppressants', selected: false },
    {
      key: 'gingival',
      label: 'Drugs causing gingival overgrowth',
      selected: false,
    },
    { key: 'none', label: 'None', selected: false },
  ];

  facialSymmetryOptions = [
    { key: 'symmetrical', label: 'Symmetrical (Normal)', selected: false },
    {
      key: 'asymmetrical',
      label: 'Asymmetrical (specify location & cause)',
      selected: false,
    },
    { key: 'paralysis', label: 'Facial paralysis', selected: false },
    { key: 'swelling', label: 'Unilateral swelling', selected: false },
  ];

  facialProfileOptions = [
    {
      key: 'straight',
      label: 'Straight (Orthognathic – Class I)',
      selected: false,
    },
    { key: 'convex', label: 'Convex (Class II)', selected: false },
    { key: 'concave', label: 'Concave (Class III)', selected: false },
  ];

  lymphNodesOptions = [
    { key: 'nonpalpable', label: 'Non-palpable (Normal)', selected: false },
    {
      key: 'palpable',
      label: 'Palpable (specify: soft / firm-fixed / tender / nodular)',
      selected: false,
    },
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
  softTissueOptions = [
    { key: 'normal', label: 'Normal', selected: false },
    {
      key: 'inflammation',
      label: 'Inflammation (red, painful)',
      selected: false,
    },
    {
      key: 'lesions',
      label: 'Lesions (aphthous ulcers, herpes)',
      selected: false,
    },
    { key: 'leukoplakia', label: 'Leukoplakia', selected: false },
    { key: 'lichen', label: 'Lichen Planus', selected: false },
    { key: 'torus', label: 'Torus', selected: false },
    { key: 'macroglossia', label: 'Macroglossia', selected: false },
  ];

  gingivalColorOptions = [
    {
      key: 'healthy',
      label: 'Coral pink, stippled (Healthy)',
      selected: false,
    },
    { key: 'acute', label: 'Red, shiny (Acute gingivitis)', selected: false },
    {
      key: 'chronic',
      label: 'Bluish, swollen (Chronic gingivitis)',
      selected: false,
    },
    {
      key: 'pigmented',
      label: 'Pigmented (Melanin pigmentation)',
      selected: false,
    },
  ];

  gingivalEnlargementOptions = [
    { key: 'none', label: 'None', selected: false },
    { key: 'localized', label: 'Localized', selected: false },
    { key: 'generalized', label: 'Generalized', selected: false },
    { key: 'drug', label: 'Drug-induced (specify drug)', selected: false },
  ];

  bleedingOnProbingOptions = [
    { key: 'none', label: 'None (Healthy)', selected: false },
    {
      key: 'present',
      label: 'Present on probing (Gingivitis)',
      selected: false,
    },
    { key: 'spontaneous', label: 'Spontaneous bleeding', selected: false },
  ];

  pocketDepthOptions = [
    { key: 'normal', label: '1–3 mm (Normal)', selected: false },
    { key: 'mild', label: '4–5 mm (Mild / Moderate)', selected: false },
    { key: 'deep', label: '≥6 mm (Deep)', selected: false },
  ];
  occlusionClassOptions = [
    { key: 'class1', label: 'Class I', selected: false },
    {
      key: 'class2',
      label: 'Class II (Division 1 / Division 2)',
      selected: false,
    },
    { key: 'class3', label: 'Class III', selected: false },
  ];

  verticalOverlapOptions = [
    { key: 'normal', label: 'Normal (2–4 mm)', selected: false },
    { key: 'deep', label: 'Deep bite', selected: false },
    { key: 'open', label: 'Open bite', selected: false },
  ];

  toothMobilityOptions = [
    { key: 'grade0', label: 'Grade 0 (<0.2 mm)', selected: false },
    { key: 'grade1', label: 'Grade I (0.2–1 mm, horizontal)', selected: false },
    { key: 'grade2', label: 'Grade II (>1 mm, horizontal)', selected: false },
    {
      key: 'grade3',
      label: 'Grade III (>1 mm, horizontal + vertical)',
      selected: false,
    },
  ];

  cariesOptions = [
    { key: 'code0', label: 'Code 0: Sound', selected: false },
    { key: 'code1_2', label: 'Code 1–2: Enamel change only', selected: false },
    {
      key: 'code3_4',
      label: 'Code 3–4: Enamel breakdown or dentin shadow',
      selected: false,
    },
    {
      key: 'code5_6',
      label: 'Code 5–6: Obvious cavity with dentin exposure',
      selected: false,
    },
  ];

  existingRestorationsOptions = [
    { key: 'intact', label: 'Intact / Satisfactory', selected: false },
    { key: 'defective', label: 'Defective / Failed', selected: false },
    { key: 'overhanging', label: 'Overhanging margins', selected: false },
    { key: 'secondary', label: 'Secondary caries', selected: false },
    { key: 'fractured', label: 'Fractured / Lost crown', selected: false },
  ];

  pulpVitalityOptions = [
    { key: 'normal', label: 'Normal, quick response', selected: false },
    {
      key: 'prolonged',
      label: 'Prolonged pain (Irreversible pulpitis)',
      selected: false,
    },
    {
      key: 'noresponse',
      label: 'No response (Pulp necrosis)',
      selected: false,
    },
    { key: 'hypersensitivity', label: 'Hypersensitivity', selected: false },
  ];
  toothDiagnosisOptions = [
    { key: 'reversible', label: 'Reversible pulpitis', selected: false },
    { key: 'irreversible', label: 'Irreversible pulpitis', selected: false },
    { key: 'necrosis', label: 'Pulp necrosis', selected: false },
    {
      key: 'periodontitis',
      label: 'Acute apical periodontitis',
      selected: false,
    },
    { key: 'abscess', label: 'Acute apical abscess', selected: false },
  ];

  periodontalDiagnosisOptions = [
    { key: 'health', label: 'Periodontal health', selected: false },
    { key: 'gingivitis', label: 'Gingivitis', selected: false },
    {
      key: 'periodontitis',
      label: 'Periodontitis (Stage I–IV, Grade A–C)',
      selected: false,
    },
  ];

  cariesRiskOptions = [
    { key: 'low', label: 'Low risk', selected: false },
    { key: 'moderate', label: 'Moderate risk', selected: false },
    { key: 'high', label: 'High / Extreme risk', selected: false },
  ];

  prognosisOptions = [
    { key: 'excellent', label: 'Excellent / Good', selected: false },
    { key: 'fair', label: 'Fair', selected: false },
    { key: 'questionable', label: 'Questionable', selected: false },
    { key: 'hopeless', label: 'Hopeless', selected: false },
  ];

  treatmentPlanOptions = [
    { key: 'emergency', label: 'Emergency / Pain relief', selected: false },
    {
      key: 'disease',
      label: 'Disease control phase (Fillings, Periodontal therapy)',
      selected: false,
    },
    {
      key: 'definitive',
      label: 'Definitive care (Crowns, Bridges, Prosthetics)',
      selected: false,
    },
    {
      key: 'maintenance',
      label: 'Maintenance / Preventive phase',
      selected: false,
    },
  ];

  private sectionMap = [
    {
      keywords: ['chief complaint', 'complaint'],
      handler: 'analyzeSpeechForChiefComplaint',
    },
    {
      keywords: ['nature of complaint', 'nature'],
      handler: 'analyzeSpeechForNatureOfComplaint',
    },
    {
      keywords: ['aggravating factors', 'factor'],
      handler: 'analyzeSpeechForAggravatingFactors',
    },
    {
      keywords: ['relevant medical history', 'medical history', 'history'],
      handler: 'analyzeSpeechForMedicalHistory',
    },
    {
      keywords: ['medication history', 'medication'],
      handler: 'analyzeSpeechForMedicationsOfConcern',
    },
    {
      keywords: ['facial symmetry', 'symmetry'],
      handler: 'analyzeSpeechForFacialSymmetry',
    },
    {
      keywords: ['facial profile', 'profile'],
      handler: 'analyzeSpeechForFacialProfile',
    },
    {
      keywords: ['lymph nodes', 'lymph'],
      handler: 'analyzeSpeechForLymphNodes',
    },
    { keywords: ['tmj sounds', 'sound'], handler: 'analyzeSpeechForTMJSounds' },
    {
      keywords: ['tmj opening', 'opening'],
      handler: 'analyzeSpeechForTMJOpening',
    },
    {
      keywords: ['tongue', 'soft tissue', 'tissues'],
      handler: 'analyzeSpeechForSoftTissue',
    },
    {
      keywords: ['gingival color', 'color texture', 'gingiva color'],
      handler: 'analyzeSpeechForGingivalColor',
    },
    {
      keywords: ['gingival enlargement', 'enlargement'],
      handler: 'analyzeSpeechForGingivalEnlargement',
    },
    {
      keywords: ['bleeding on probing', 'bop', 'bleeding probing'],
      handler: 'analyzeSpeechForBleedingOnProbing',
    },
    {
      keywords: ['pocket depth', 'probing depth', 'pd'],
      handler: 'analyzeSpeechForPocketDepth',
    },
    {
      keywords: [
        'angle classification',
        'occlusion class',
        'class one',
        'class two',
        'class three',
      ],
      handler: 'analyzeSpeechForOcclusionClass',
    },
    {
      keywords: ['vertical overlap', 'overbite'],
      handler: 'analyzeSpeechForVerticalOverlap',
    },
    {
      keywords: ['tooth mobility', 'mobility'],
      handler: 'analyzeSpeechForToothMobility',
    },
    { keywords: ['caries', 'icdas'], handler: 'analyzeSpeechForCaries' },
    {
      keywords: ['existing restoration', 'restoration', 'fillings'],
      handler: 'analyzeSpeechForExistingRestorations',
    },
    {
      keywords: ['pulp vitality', 'cold test', 'vitality'],
      handler: 'analyzeSpeechForPulpVitality',
    },
    {
      keywords: ['tooth diagnosis', 'pulpitis', 'apical', 'abscess'],
      handler: 'analyzeSpeechForToothDiagnosis',
    },
    {
      keywords: [
        'periodontal diagnosis',
        'periodontitis',
        'gingivitis',
        'gum disease',
      ],
      handler: 'analyzeSpeechForPeriodontalDiagnosis',
    },
    {
      keywords: ['caries risk', 'risk assessment'],
      handler: 'analyzeSpeechForCariesRisk',
    },
    { keywords: ['prognosis'], handler: 'analyzeSpeechForPrognosis' },
    {
      keywords: ['treatment plan', 'basic plan', 'phase'],
      handler: 'analyzeSpeechForTreatmentPlan',
    },
  ];
  buildStartCaseData() {
    const clinicalInvestigation = [
      {
        question: 'Chief Complaint',
        answer: this.getSelectedLabels(this.chiefComplaintOptions),
      },
      {
        question: 'Nature of Complaint',
        answer: this.getSelectedLabels(this.natureOfComplaintOptions),
      },
      {
        question: 'Aggravating Factors',
        answer: this.getSelectedLabels(this.aggravatingFactorsOptions),
      },
      {
        question: 'Medical History',
        answer: this.getSelectedLabels(this.medicalHistoryOptions),
      },
      {
        question: 'Medications of Concern',
        answer: this.getSelectedLabels(this.medicationsOfConcernOptions),
      },
      {
        question: 'Facial Symmetry',
        answer: this.getSelectedLabels(this.facialSymmetryOptions),
      },
      {
        question: 'Facial Profile',
        answer: this.getSelectedLabels(this.facialProfileOptions),
      },
      {
        question: 'Lymph Nodes',
        answer: this.getSelectedLabels(this.lymphNodesOptions),
      },
      {
        question: 'TMJ Sounds',
        answer: this.getSelectedLabels(this.tmjSoundsOptions),
      },
      {
        question: 'TMJ Opening',
        answer: this.getSelectedLabels(this.tmjOpeningOptions),
      },
      {
        question: 'Soft Tissue Examination',
        answer: this.getSelectedLabels(this.softTissueOptions),
      },
      {
        question: 'Gingival Color & Texture',
        answer: this.getSelectedLabels(this.gingivalColorOptions),
      },
      {
        question: 'Gingival Enlargement',
        answer: this.getSelectedLabels(this.gingivalEnlargementOptions),
      },
      {
        question: 'Bleeding on Probing',
        answer: this.getSelectedLabels(this.bleedingOnProbingOptions),
      },
      {
        question: 'Pocket Depth',
        answer: this.getSelectedLabels(this.pocketDepthOptions),
      },
      {
        question: 'Occlusion Class',
        answer: this.getSelectedLabels(this.occlusionClassOptions),
      },
      {
        question: 'Vertical Overlap',
        answer: this.getSelectedLabels(this.verticalOverlapOptions),
      },
      {
        question: 'Tooth Mobility',
        answer: this.getSelectedLabels(this.toothMobilityOptions),
      },
      {
        question: 'Caries (ICDAS)',
        answer: this.getSelectedLabels(this.cariesOptions),
      },
      {
        question: 'Existing Restorations',
        answer: this.getSelectedLabels(this.existingRestorationsOptions),
      },
      {
        question: 'Pulp Vitality',
        answer: this.getSelectedLabels(this.pulpVitalityOptions),
      },
      {
        question: 'Tooth Diagnosis',
        answer: this.getSelectedLabels(this.toothDiagnosisOptions),
      },
      {
        question: 'Periodontal Diagnosis',
        answer: this.getSelectedLabels(this.periodontalDiagnosisOptions),
      },
      {
        question: 'Caries Risk',
        answer: this.getSelectedLabels(this.cariesRiskOptions),
      },
      {
        question: 'Prognosis',
        answer: this.getSelectedLabels(this.prognosisOptions),
      },
      {
        question: 'Treatment Plan',
        answer: this.getSelectedLabels(this.treatmentPlanOptions),
      },
    ];
    const filteredInvestigation = clinicalInvestigation
      .filter((i) => i.answer && i.answer.length > 0)
      .reduce((acc, item) => {
        acc[item.question] = item.answer;
        return acc;
      }, {} as Record<string, string[]>);
    const data = {
      images: this.uploadedFiles.map((f) => f.name), // في API الحقيقي هنبعته multipart
      appointmentId: this.appointmentId,
      chiefComplaint: this.chiefComplaint,
      clinicalInvestigation: filteredInvestigation,
      medications: [],
      diseases: [],
      diagnosis: '',
      treatmentPlan: '',
      instructionsBetweenVisits: '',
    };

    return data;
  }
  getSelectedLabels(options: { label: string; selected: boolean }[]): string[] {
    return options.filter((o) => o.selected).map((o) => o.label);
  }
  private mediaStream: MediaStream | null = null;
  private mediaRecorder?: MediaRecorder;
  private chunks: Blob[] = [];
  private timerRef?: any;
  private seconds = 0;
  private currentSection: string | null = null;

  audioBlob: Blob | null = null;
  audioUrl: string | null = null;

  constructor(
    private cdRef: ChangeDetectorRef,
    private speechService: WebSpeechService,
    private route: ActivatedRoute,
    private _Router: Router,
    private startCaseState: StartCaseStateService,
    private caseState: CaseStateService
  ) {}

  ngOnInit(): void {
    this.fromPage = this.route.snapshot.queryParamMap.get('from');
    const id = this.route.snapshot.paramMap.get('id');

    if (this.fromPage === 'patient-profile') {
      this.patientId = id;
    } else {
      this.appointmentId = id;
    }

    console.log(
      '🩺 fromPage:',
      this.fromPage,
      'appointmentId:',
      this.appointmentId,
      'patientId:',
      this.patientId
    );

    const caseData = this.caseState.getCaseData();
    if (caseData) {
      this.chiefComplaint = caseData.chiefComplaint;
      console.log('📦 Loaded from Assign Case:', caseData);
    }
  }

  get formattedTime(): string {
    const m = Math.floor(this.seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (this.seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  async toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
      this.stopListening();
      this.isRecording = false;
    } else {
      this.isRecording = true;
      this.transcriptionResult = 'Listening...';
      this.seconds = 0;

      await this.startRecording();

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
        const blobType = 'audio/mp4';
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
        this.cdRef.detectChanges();
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

  // 🎯 تحليل الكلام حسب السياق
  private analyzeSpeechWithContext(transcript: string) {
    const lower = transcript.toLowerCase();

    // 🧩 نحدد بداية ونهاية كل قسم داخل النص
    let foundSections: { handler: string; start: number; end: number }[] = [];

    this.sectionMap.forEach((section) => {
      section.keywords.forEach((k) => {
        const index = lower.indexOf(k);
        if (index !== -1) {
          foundSections.push({
            handler: section.handler,
            start: index,
            end: index + k.length,
          });
        }
      });
    });

    // ✨ نرتب الأقسام حسب موقعها في النص
    foundSections = foundSections.sort((a, b) => a.start - b.start);

    // لو مفيش ولا قسم متعرف → استخدم السياق الحالي فقط
    if (foundSections.length === 0) {
      if (this.currentSection) {
        const fn = (this as any)[this.currentSection];
        if (typeof fn === 'function') fn.call(this, lower);
      }
      return;
    }

    // 🔄 نمر على كل قسم وناخد الكلام اللي بعده لحد القسم اللي بعده
    for (let i = 0; i < foundSections.length; i++) {
      const current = foundSections[i];
      const next = foundSections[i + 1];
      const start = current.end;
      const end = next ? next.start : lower.length;
      const sectionText = lower.substring(start, end).trim();

      this.currentSection = current.handler;
      const fn = (this as any)[this.currentSection];
      if (typeof fn === 'function' && sectionText) {
        console.log(
          `🧠 Analyzing section: ${this.currentSection} →`,
          sectionText
        );
        fn.call(this, sectionText);
      }
    }
  }

  // ✅ دوال التحليل (بدون reset)
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

    this.chiefComplaintOptions.forEach((opt) => {
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

    this.natureOfComplaintOptions.forEach((opt) => {
      const keywords = map[opt.key] ?? [];
      if (keywords.some((k) => lowerText.includes(k))) {
        opt.selected = true;
      }
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

    this.aggravatingFactorsOptions.forEach((opt) => {
      const keywords = map[opt.key] ?? [];
      if (keywords.some((k) => lowerText.includes(k))) {
        opt.selected = true;
      }
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

    this.medicalHistoryOptions.forEach((opt) => {
      const keywords = map[opt.key] ?? [];
      if (keywords.some((k) => lowerText.includes(k))) {
        opt.selected = true;
      }
    });
  }

  analyzeSpeechForMedicationsOfConcern(transcript: string) {
    const lowerText = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      anticoagulants: ['warfarin', 'anticoagulant', 'blood thinner'],
      bisphosphonates: ['bisphosphonate', 'bone drug', 'osteoporosis medicine'],
      immunosuppressants: [
        'immunosuppressant',
        'steroids',
        'prednisone',
        'cyclosporine',
      ],
      gingival: ['gingival', 'gum overgrowth', 'phenytoin', 'nifedipine'],
      none: ['none', 'no medication', 'nothing'],
    };

    this.medicationsOfConcernOptions.forEach((opt) => {
      const keywords = map[opt.key] ?? [];
      if (keywords.some((k) => lowerText.includes(k))) {
        opt.selected = true;
      }
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

    this.facialSymmetryOptions.forEach((opt) => {
      const keywords = map[opt.key] ?? [];
      if (keywords.some((k) => lowerText.includes(k))) {
        opt.selected = true;
      }
    });
  }

  analyzeSpeechForFacialProfile(transcript: string) {
    const lowerText = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      straight: ['straight profile', 'normal profile', 'class one'],
      convex: ['convex', 'class two', 'protruded'],
      concave: ['concave', 'class three', 'receded'],
    };

    this.facialProfileOptions.forEach((opt) => {
      const keywords = map[opt.key] ?? [];
      if (keywords.some((k) => lowerText.includes(k))) {
        opt.selected = true;
      }
    });
  }

  analyzeSpeechForLymphNodes(transcript: string) {
    const lowerText = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      nonpalpable: ['normal lymph', 'non palpable', 'not felt'],
      palpable: ['palpable', 'tender node', 'swollen node', 'enlarged gland'],
    };

    this.lymphNodesOptions.forEach((opt) => {
      const keywords = map[opt.key] ?? [];
      if (keywords.some((k) => lowerText.includes(k))) {
        opt.selected = true;
      }
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

    this.tmjSoundsOptions.forEach((opt) => {
      const keywords = map[opt.key] ?? [];
      if (keywords.some((k) => lowerText.includes(k))) {
        opt.selected = true;
      }
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

    this.tmjOpeningOptions.forEach((opt) => {
      const keywords = map[opt.key] ?? [];
      if (keywords.some((k) => lowerText.includes(k))) {
        opt.selected = true;
      }
    });
  }
  analyzeSpeechForSoftTissue(transcript: string) {
    const lower = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      normal: ['normal', 'healthy', 'no problem'],
      inflammation: ['inflammation', 'red', 'painful', 'sore'],
      lesions: ['lesion', 'ulcer', 'aphthous', 'herpes', 'blister'],
      leukoplakia: ['leukoplakia', 'white patch'],
      lichen: ['lichen', 'planus'],
      torus: ['torus', 'bony growth'],
      macroglossia: ['macroglossia', 'large tongue', 'enlarged tongue'],
    };
    this.softTissueOptions.forEach((opt) => {
      if (map[opt.key].some((k) => lower.includes(k))) opt.selected = true;
    });
  }

  analyzeSpeechForGingivalColor(transcript: string) {
    const lower = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      healthy: ['coral', 'pink', 'stippled', 'healthy'],
      acute: ['red', 'shiny', 'acute'],
      chronic: ['blue', 'bluish', 'swollen', 'chronic'],
      pigmented: ['pigment', 'dark gum', 'melanin'],
    };
    this.gingivalColorOptions.forEach((opt) => {
      if (map[opt.key].some((k) => lower.includes(k))) opt.selected = true;
    });
  }

  analyzeSpeechForGingivalEnlargement(transcript: string) {
    const lower = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      none: ['none', 'no enlargement', 'normal'],
      localized: ['localized', 'small area'],
      generalized: ['generalized', 'whole mouth', 'diffuse'],
      drug: ['drug', 'phenytoin', 'nifedipine', 'cyclosporine'],
    };
    this.gingivalEnlargementOptions.forEach((opt) => {
      if (map[opt.key].some((k) => lower.includes(k))) opt.selected = true;
    });
  }

  analyzeSpeechForBleedingOnProbing(transcript: string) {
    const lower = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      none: ['none', 'no bleeding', 'healthy'],
      present: ['present', 'on probing', 'gingivitis', 'bleed'],
      spontaneous: ['spontaneous', 'bleeding alone', 'bleeds easily'],
    };
    this.bleedingOnProbingOptions.forEach((opt) => {
      if (map[opt.key].some((k) => lower.includes(k))) opt.selected = true;
    });
  }

  analyzeSpeechForPocketDepth(transcript: string) {
    const lower = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      normal: ['normal', 'one', 'two', 'three mm'],
      mild: ['mild', 'moderate', 'four', 'five mm'],
      deep: ['deep', 'six', 'seven', 'eight mm'],
    };
    this.pocketDepthOptions.forEach((opt) => {
      if (map[opt.key].some((k) => lower.includes(k))) opt.selected = true;
    });
  }
  analyzeSpeechForOcclusionClass(transcript: string) {
    const lower = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      class1: ['class 1', 'normal occlusion', 'angle one'],
      class2: ['class 2', 'division 1', 'division 2', 'retrognathic'],
      class3: ['class 3', 'prognathic'],
    };
    this.occlusionClassOptions.forEach((opt) => {
      if (map[opt.key].some((k) => lower.includes(k))) opt.selected = true;
    });
  }

  analyzeSpeechForVerticalOverlap(transcript: string) {
    const lower = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      normal: [
        'normal',
        'two millimeters',
        'three millimeters',
        'four millimeters',
      ],
      deep: ['deep bite', 'increased overlap', 'excessive vertical'],
      open: ['open bite', 'gap', 'no overlap'],
    };
    this.verticalOverlapOptions.forEach((opt) => {
      if (map[opt.key].some((k) => lower.includes(k))) opt.selected = true;
    });
  }

  analyzeSpeechForToothMobility(transcript: string) {
    const lower = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      grade0: ['grade 0', 'no mobility', 'stable'],
      grade1: ['grade 1', 'mild mobility', 'slight movement'],
      grade2: ['grade 2', 'moderate mobility', 'one millimeter'],
      grade3: [
        'grade 3',
        'severe mobility',
        'vertical movement',
        'highly mobile',
      ],
    };
    this.toothMobilityOptions.forEach((opt) => {
      if (map[opt.key].some((k) => lower.includes(k))) opt.selected = true;
    });
  }

  analyzeSpeechForCaries(transcript: string) {
    const lower = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      code0: ['sound', 'no caries', 'healthy'],
      code1_2: ['code 1', 'code 2', 'enamel change', 'white spot'],
      code3_4: ['code 3', 'code 4', 'dentin shadow', 'enamel breakdown'],
      code5_6: ['code 5', 'code 6', 'cavity', 'dentin exposure', 'deep caries'],
    };
    this.cariesOptions.forEach((opt) => {
      if (map[opt.key].some((k) => lower.includes(k))) opt.selected = true;
    });
  }

  analyzeSpeechForExistingRestorations(transcript: string) {
    const lower = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      intact: ['intact', 'satisfactory', 'good restoration'],
      defective: ['defective', 'failed', 'broken filling'],
      overhanging: ['overhanging', 'extra margin', 'over contour'],
      secondary: ['secondary caries', 'recurrent decay'],
      fractured: ['fractured crown', 'lost crown', 'broken restoration'],
    };
    this.existingRestorationsOptions.forEach((opt) => {
      if (map[opt.key].some((k) => lower.includes(k))) opt.selected = true;
    });
  }

  analyzeSpeechForPulpVitality(transcript: string) {
    const lower = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      normal: ['normal', 'quick response', 'healthy pulp'],
      prolonged: ['prolonged pain', 'irreversible', 'lingering pain'],
      noresponse: ['no response', 'pulp necrosis', 'dead pulp'],
      hypersensitivity: ['hypersensitive', 'sensitive', 'sharp pain cold'],
    };
    this.pulpVitalityOptions.forEach((opt) => {
      if (map[opt.key].some((k) => lower.includes(k))) opt.selected = true;
    });
  }
  analyzeSpeechForToothDiagnosis(transcript: string) {
    const lower = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      reversible: [
        'reversible pulpitis',
        'mild pain',
        'short response',
        'temporary pain',
      ],
      irreversible: [
        'irreversible pulpitis',
        'prolonged pain',
        'lingering',
        'severe pain',
      ],
      necrosis: ['pulp necrosis', 'dead tooth', 'no response', 'non vital'],
      periodontitis: [
        'apical periodontitis',
        'periapical',
        'tender tooth',
        'biting pain',
      ],
      abscess: ['abscess', 'swelling', 'pus', 'infection'],
    };
    this.toothDiagnosisOptions.forEach((opt) => {
      if (map[opt.key].some((k) => lower.includes(k))) opt.selected = true;
    });
  }

  analyzeSpeechForPeriodontalDiagnosis(transcript: string) {
    const lower = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      health: ['healthy gums', 'periodontal health', 'no disease'],
      gingivitis: ['gingivitis', 'bleeding gums', 'gum inflammation'],
      periodontitis: [
        'periodontitis',
        'bone loss',
        'deep pockets',
        'advanced gum disease',
      ],
    };
    this.periodontalDiagnosisOptions.forEach((opt) => {
      if (map[opt.key].some((k) => lower.includes(k))) opt.selected = true;
    });
  }

  analyzeSpeechForCariesRisk(transcript: string) {
    const lower = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      low: ['low risk', 'no decay', 'good hygiene'],
      moderate: ['moderate risk', 'some decay', 'average hygiene'],
      high: ['high risk', 'many cavities', 'extreme risk', 'poor hygiene'],
    };
    this.cariesRiskOptions.forEach((opt) => {
      if (map[opt.key].some((k) => lower.includes(k))) opt.selected = true;
    });
  }

  analyzeSpeechForPrognosis(transcript: string) {
    const lower = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      excellent: ['excellent', 'good prognosis', 'favorable'],
      fair: ['fair', 'moderate prognosis'],
      questionable: ['questionable', 'uncertain', 'doubtful'],
      hopeless: ['hopeless', 'poor prognosis', 'non restorable'],
    };
    this.prognosisOptions.forEach((opt) => {
      if (map[opt.key].some((k) => lower.includes(k))) opt.selected = true;
    });
  }

  analyzeSpeechForTreatmentPlan(transcript: string) {
    const lower = transcript.toLowerCase();
    const map: Record<string, string[]> = {
      emergency: ['emergency', 'pain relief', 'urgent care'],
      disease: [
        'disease control',
        'fillings',
        'periodontal therapy',
        'scaling',
      ],
      definitive: [
        'definitive care',
        'crowns',
        'bridges',
        'prosthetics',
        'final restoration',
      ],
      maintenance: [
        'maintenance',
        'follow up',
        'preventive phase',
        'recall visit',
      ],
    };
    this.treatmentPlanOptions.forEach((opt) => {
      if (map[opt.key].some((k) => lower.includes(k))) opt.selected = true;
    });
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
            file: file,
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  goBackToPatoentProfile() {
    this._Router.navigate([
      `dashboard/patients/${this.patientId}/appointment-history`,
    ]);
  }

  aiLink(): any[] {
    if (this.fromPage === 'patient-profile') {
      return ['/dashboard/patients/start-case/generate-ai', this.patientId];
    }
    return ['/dashboard/appointments/generate-ai', this.appointmentId];
  }

  manualLink(): any[] {
    if (this.fromPage === 'patient-profile') {
      return [
        '/dashboard/patients/start-case/manual-diagnosis',
        this.patientId,
      ];
    }
    return ['/dashboard/appointments/manual-diagnosis', this.appointmentId];
  }
  saveStartCase() {
    const startCaseData = this.buildStartCaseData();
    console.log('🧾 Start Case Data:', startCaseData);

    // نحفظها في السيرفيس
    this.startCaseState.setStartCaseData(startCaseData);

    // نوجّه المستخدم للـ Manual Diagnosis
    this._Router.navigate([
      '/dashboard/appointments/manual-diagnosis',
      this.appointmentId,
    ]);
  }
  onManualDiagnosisClick() {
    const startCaseData = this.buildStartCaseData();
    console.log('🧾 Start Case Data:', startCaseData);
    this.startCaseState.setStartCaseData(startCaseData);

    let route: any[] = [];
    if (this.fromPage === 'patient-profile') {
      if (!this.patientId) {
        console.error('❌ patientId is null!');
        return;
      }
      route = [
        '/dashboard/patients/start-case/manual-diagnosis',
        this.patientId,
      ];
    } else {
      if (!this.appointmentId) {
        console.error('❌ appointmentId is null!');
        return;
      }
      route = ['/dashboard/appointments/manual-diagnosis', this.appointmentId];
    }

    this._Router.navigate(route, { queryParams: { from: this.fromPage } });
  }
}
