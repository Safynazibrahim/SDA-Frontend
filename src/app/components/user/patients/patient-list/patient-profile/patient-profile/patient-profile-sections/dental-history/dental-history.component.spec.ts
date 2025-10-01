import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalHistoryComponent } from './dental-history.component';

describe('DentalHistoryComponent', () => {
  let component: DentalHistoryComponent;
  let fixture: ComponentFixture<DentalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DentalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
