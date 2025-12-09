import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralCaseComponent } from './referral-case.component';

describe('ReferralCaseComponent', () => {
  let component: ReferralCaseComponent;
  let fixture: ComponentFixture<ReferralCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralCaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReferralCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
