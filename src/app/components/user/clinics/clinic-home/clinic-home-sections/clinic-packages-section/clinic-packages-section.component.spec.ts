import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicPackagesSectionComponent } from './clinic-packages-section.component';

describe('ClinicPackagesSectionComponent', () => {
  let component: ClinicPackagesSectionComponent;
  let fixture: ComponentFixture<ClinicPackagesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicPackagesSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClinicPackagesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
