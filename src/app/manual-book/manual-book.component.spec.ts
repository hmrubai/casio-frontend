import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualBookComponent } from './manual-book.component';

describe('ManualBookComponent', () => {
  let component: ManualBookComponent;
  let fixture: ComponentFixture<ManualBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualBookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
