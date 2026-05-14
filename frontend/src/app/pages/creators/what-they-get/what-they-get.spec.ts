import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatTheyGet } from './what-they-get';

describe('WhatTheyGet', () => {
  let component: WhatTheyGet;
  let fixture: ComponentFixture<WhatTheyGet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatTheyGet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatTheyGet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
