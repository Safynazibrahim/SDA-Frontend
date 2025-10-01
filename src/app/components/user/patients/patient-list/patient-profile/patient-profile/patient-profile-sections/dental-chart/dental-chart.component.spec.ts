import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalChartComponent } from './dental-chart.component';

describe('DentalChartComponent', () => {
  let component: DentalChartComponent;
  let fixture: ComponentFixture<DentalChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DentalChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
