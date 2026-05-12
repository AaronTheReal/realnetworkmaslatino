import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParterUs } from './parter-us';

describe('ParterUs', () => {
  let component: ParterUs;
  let fixture: ComponentFixture<ParterUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParterUs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParterUs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
