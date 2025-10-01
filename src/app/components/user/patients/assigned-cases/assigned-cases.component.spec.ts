import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedCasesComponent } from './assigned-cases.component';

describe('AssignedCasesComponent', () => {
  let component: AssignedCasesComponent;
  let fixture: ComponentFixture<AssignedCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedCasesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignedCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
