import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicInventorySectionComponent } from './clinic-inventory-section.component';

describe('ClinicInventorySectionComponent', () => {
  let component: ClinicInventorySectionComponent;
  let fixture: ComponentFixture<ClinicInventorySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicInventorySectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClinicInventorySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
