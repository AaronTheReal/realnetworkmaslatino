import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatMaslatinoIs } from './what-maslatino-is';

describe('WhatMaslatinoIs', () => {
  let component: WhatMaslatinoIs;
  let fixture: ComponentFixture<WhatMaslatinoIs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatMaslatinoIs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatMaslatinoIs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
