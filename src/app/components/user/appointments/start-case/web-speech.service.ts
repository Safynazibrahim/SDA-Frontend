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

  // async transcribeBlob(blob: Blob, lang: Lang): Promise<string> {
  //   if (!this.isSupported) {
  //     throw new Error('❌ Web Speech API not supported. Use Chrome, Edge, or Safari.');
  //   }

  //   // تحويل الـ blob لـ audio وتشغيله
  //   const audioUrl = URL.createObjectURL(blob);
  //   const audio = new Audio(audioUrl);

  //   return new Promise((resolve, reject) => {
  //     this.recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      
  //     let finalTranscript = '';
  //     let timeoutId: any;

  //     this.recognition.onresult = (event: any) => {
  //       clearTimeout(timeoutId);
        
  //       let interimTranscript = '';
        
  //       for (let i = event.resultIndex; i < event.results.length; i++) {
  //         const transcript = event.results[i][0].transcript;
          
  //         if (event.results[i].isFinal) {
  //           finalTranscript += transcript + ' ';
  //           console.log('✅ Final piece:', transcript);
  //         } else {
  //           interimTranscript += transcript;
  //           console.log('🔄 Interim:', transcript);
  //         }
  //       }
        
  //       // انتظر 1 ثانية بعد آخر نتيجة
  //       timeoutId = setTimeout(() => {
  //         this.recognition.stop();
  //       }, 1000);
  //     };

  //     this.recognition.onerror = (event: any) => {
  //       console.error('❌ Recognition error:', event.error);
  //       this.recognition.stop();
  //       audio.pause();
  //       URL.revokeObjectURL(audioUrl);
        
  //       if (event.error === 'no-speech') {
  //         resolve(''); // مفيش كلام في الصوت
  //       } else {
  //         reject(new Error(`Speech recognition error: ${event.error}`));
  //       }
  //     };

  //     this.recognition.onend = () => {
  //       console.log('🏁 Recognition ended. Final result:', finalTranscript.trim());
  //       audio.pause();
  //       URL.revokeObjectURL(audioUrl);
  //       resolve(finalTranscript.trim());
  //     };

  //     // شغل الصوت والـ recognition معاً
  //     audio.play().catch((err) => {
  //       console.error('❌ Audio playback error:', err);
  //       this.recognition.stop();
  //       URL.revokeObjectURL(audioUrl);
  //       reject(err);
  //     });

  //     this.recognition.start();
  //     console.log('🎤 Recognition started for language:', lang);
  //   });
  // }
async startListening(
  lang: 'en' | 'ar',
  onResult: (text: string) => void,
  onEnd?: () => void
) {
  if (!this.isSupported) {
    throw new Error('❌ Web Speech API not supported. Use Chrome, Edge, or Safari.');
  }

  this.recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
  this.recognition.continuous = true; // ✅ خليه مستمر
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
    // لو فيه خطأ "no-speech" بعد صمت، نعيد التشغيل بدل ما نقف
    if (event.error === 'no-speech') {
      try {
        console.log('🔁 Restarting recognition after silence...');
        this.recognition.stop();
        setTimeout(() => this.recognition.start(), 300);
      } catch (err) {
        console.error('Restart error:', err);
      }
    }
  };

  this.recognition.onend = () => {
    console.log('🎤 Recognition ended unexpectedly (silence or pause)');
    // نعيد التشغيل لو المستخدم لسه بيسجل
    try {
      console.log('🔁 Restarting continuous recognition...');
      this.recognition.start();
    } catch (err) {
      console.error('Restart error:', err);
    }
  };

  this.recognition.start();
  console.log('🎙️ Speech recognition started continuously...');
}


stopListening() {
  if (this.recognition) {
    this.recognition.stop();
  }
}

  isApiSupported(): boolean {
    return this.isSupported;
  }

  getSupportedLanguages(): string[] {
    return ['ar-SA', 'en-US', 'en-GB'];
  }
}