import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleGroupComponent } from './toggle-group.component';

describe('ToggleGroupComponent', () => {
  let component: ToggleGroupComponent;
  let fixture: ComponentFixture<ToggleGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
