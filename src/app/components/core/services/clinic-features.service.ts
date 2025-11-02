import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClinicFeaturesService {
  private clinicFeatures: Record<string, any> = {};

  setClinicFeatures(features: Record<string, any>) {
    this.clinicFeatures = features;
    console.log(this.clinicFeatures)
  }

  getFeature(key: string) {
    return this.clinicFeatures[key] || null;
  }

  hasFeature(key: string): boolean {
    const feature = this.getFeature(key);
    return feature && feature.type !== 'none';
  }

  getRemaining(key: string): number | null {
    const feature = this.getFeature(key);
    return feature?.type === 'limited' ? feature.remaining : null;
  }
}
