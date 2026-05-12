import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReachPower } from './reach-power';

describe('ReachPower', () => {
  let component: ReachPower;
  let fixture: ComponentFixture<ReachPower>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReachPower]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReachPower);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
