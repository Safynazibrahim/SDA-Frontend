import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalAnalysisComponent } from './dental-analysis.component';

describe('DentalAnalysisComponent', () => {
  let component: DentalAnalysisComponent;
  let fixture: ComponentFixture<DentalAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalAnalysisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DentalAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
