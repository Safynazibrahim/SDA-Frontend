import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WebSpeechService {
  private recognition: any;
  private isSupported = false;

  constructor() {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.isSupported = true;
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
    }
  }
// async startListening(
//   lang: 'en' | 'ar',
//   onResult: (text: string) => void,
//   onEnd?: () => void
// ) {
//   if (!this.isSupported) {
//     throw new Error('❌ Web Speech API not supported. Use Chrome, Edge, or Safari.');
//   }

//   this.recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
//   this.recognition.continuous = true; // ✅ خليه مستمر
//   this.recognition.interimResults = true;

//   let finalTranscript = '';

//   this.recognition.onresult = (event: any) => {
//     let interimTranscript = '';
//     for (let i = event.resultIndex; i < event.results.length; i++) {
//       const transcript = event.results[i][0].transcript;
//       if (event.results[i].isFinal) {
//         finalTranscript += transcript + ' ';
//       } else {
//         interimTranscript += transcript;
//       }
//     }
//     onResult(finalTranscript + interimTranscript);
//   };

//   this.recognition.onerror = (event: any) => {
//     console.error('❌ Recognition error:', event.error);
//     // لو فيه خطأ "no-speech" بعد صمت، نعيد التشغيل بدل ما نقف
//     if (event.error === 'no-speech') {
//       try {
//         console.log('🔁 Restarting recognition after silence...');
//         this.recognition.stop();
//         setTimeout(() => this.recognition.start(), 300);
//       } catch (err) {
//         console.error('Restart error:', err);
//       }
//     }
//   };

//   this.recognition.onend = () => {
//     console.log('🎤 Recognition ended unexpectedly (silence or pause)');
//     // نعيد التشغيل لو المستخدم لسه بيسجل
//     try {
//       console.log('🔁 Restarting continuous recognition...');
//       this.recognition.start();
//     } catch (err) {
//       console.error('Restart error:', err);
//     }
//   };

//   this.recognition.start();
//   console.log('🎙️ Speech recognition started continuously...');
// }


// stopListening() {
//   if (this.recognition) {
//     this.recognition.stop();
//   }
// }
async startListening(
  lang: 'en' | 'ar',
  onResult: (text: string) => void,
  onEnd?: () => void
) {
  if (!this.isSupported) {
    throw new Error('❌ Web Speech API not supported.');
  }

  // 🔹 لو فيه session قديمة، اقفلها ونضفها
  try {
    this.recognition.onresult = null;
    this.recognition.onerror = null;
    this.recognition.onend = null;
    this.recognition.stop();
  } catch (_) {}

  // 🔹 أنشئ instance جديدة كل مرة
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  this.recognition = new SpeechRecognition();
  this.recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
  this.recognition.continuous = true;
  this.recognition.interimResults = true;

  let finalTranscript = '';

  this.recognition.onresult = (event: any) => {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }
    onResult(finalTranscript + interimTranscript);
  };

  this.recognition.onerror = (event: any) => {
    console.error('❌ Recognition error:', event.error);
    if (event.error === 'no-speech') {
      console.log('🔁 Restarting recognition after silence...');
      try {
        this.recognition.stop();
        setTimeout(() => this.recognition.start(), 300);
      } catch (err) {
        console.error('Restart error:', err);
      }
    }
  };

  this.recognition.onend = () => {
    console.log('🏁 Recognition ended');
    if (onEnd) onEnd();
  };

  this.recognition.start();
  console.log('🎙️ Speech recognition started fresh...');
}

stopListening() {
  try {
    if (this.recognition) {
      this.recognition.onresult = null;
      this.recognition.onerror = null;
      this.recognition.onend = null;
      this.recognition.stop();
      console.log('🛑 Recognition stopped & cleaned up');
    }
  } catch (err) {
    console.warn('Stop error:', err);
  }
}

  isApiSupported(): boolean {
    return this.isSupported;
  }

  getSupportedLanguages(): string[] {
    return ['ar-SA', 'en-US', 'en-GB'];
  }
}