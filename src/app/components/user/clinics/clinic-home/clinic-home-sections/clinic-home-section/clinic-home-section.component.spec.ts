import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicHomeSectionComponent } from './clinic-home-section.component';

describe('ClinicHomeSectionComponent', () => {
  let component: ClinicHomeSectionComponent;
  let fixture: ComponentFixture<ClinicHomeSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicHomeSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClinicHomeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
