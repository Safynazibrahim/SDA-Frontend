import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FaceLandmarkerService {

  private instance: any = null;
  private loadingPromise: Promise<any> | null = null;
  private FaceLandmarkerClass: any = null;

  // ── Load MediaPipe once, reuse everywhere ──────────────────────────────────
  async get(): Promise<any> {
    if (this.instance) return this.instance;
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = this.load();
    return this.loadingPromise;
  }

  private async load(): Promise<any> {
    const moduleUrl =
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/vision_bundle.mjs';

    // Dynamic import — no npm install needed
    const vision: any = await (Function(`return import("${moduleUrl}")`)() as Promise<any>);
    const { FaceLandmarker, FilesetResolver } = vision;

    this.FaceLandmarkerClass = FaceLandmarker;

    const filesetResolver = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm',
    );

    this.instance = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU',
      },
      runningMode: 'IMAGE', // default, we change per use
      numFaces: 1,
    });

    return this.instance;
  }

  // ── Switch mode between IMAGE and VIDEO ────────────────────────────────────
  async setMode(mode: 'IMAGE' | 'VIDEO'): Promise<void> {
    if (this.instance && this.FaceLandmarkerClass) {
      await this.instance.setOptions({ runningMode: mode });
    }
  }

  isReady(): boolean {
    return this.instance !== null;
  }
}