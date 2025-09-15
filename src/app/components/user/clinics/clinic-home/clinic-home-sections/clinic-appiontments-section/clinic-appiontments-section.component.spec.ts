import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicAppiontmentsSectionComponent } from './clinic-appiontments-section.component';

describe('ClinicAppiontmentsSectionComponent', () => {
  let component: ClinicAppiontmentsSectionComponent;
  let fixture: ComponentFixture<ClinicAppiontmentsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicAppiontmentsSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClinicAppiontmentsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
