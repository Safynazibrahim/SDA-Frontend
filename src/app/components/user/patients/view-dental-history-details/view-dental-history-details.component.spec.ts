import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDentalHistoryDetailsComponent } from './view-dental-history-details.component';

describe('ViewDentalHistoryDetailsComponent', () => {
  let component: ViewDentalHistoryDetailsComponent;
  let fixture: ComponentFixture<ViewDentalHistoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDentalHistoryDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewDentalHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
