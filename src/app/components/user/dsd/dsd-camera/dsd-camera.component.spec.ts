import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsdCameraComponent } from './dsd-camera.component';

describe('DsdCameraComponent', () => {
  let component: DsdCameraComponent;
  let fixture: ComponentFixture<DsdCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsdCameraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DsdCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
