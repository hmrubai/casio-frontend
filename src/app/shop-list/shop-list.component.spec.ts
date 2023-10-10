import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SHopListComponent } from './shop-list.component';

describe('SHopListComponent', () => {
  let component: SHopListComponent;
  let fixture: ComponentFixture<SHopListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SHopListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SHopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
