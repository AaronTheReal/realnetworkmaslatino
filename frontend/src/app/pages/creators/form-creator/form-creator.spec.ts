import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreator } from './form-creator';

describe('FormCreator', () => {
  let component: FormCreator;
  let fixture: ComponentFixture<FormCreator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCreator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCreator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
