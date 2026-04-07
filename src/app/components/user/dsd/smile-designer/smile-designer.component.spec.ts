import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmileDesignerComponent } from './smile-designer.component';

describe('SmileDesignerComponent', () => {
  let component: SmileDesignerComponent;
  let fixture: ComponentFixture<SmileDesignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmileDesignerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmileDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
