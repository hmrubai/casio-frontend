import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsdListComponent } from './osd-list.component';

describe('OsdListComponent', () => {
  let component: OsdListComponent;
  let fixture: ComponentFixture<OsdListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OsdListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OsdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
