import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTeams } from './form-teams';

describe('FormTeams', () => {
  let component: FormTeams;
  let fixture: ComponentFixture<FormTeams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTeams],
    }).compileComponents();

    fixture = TestBed.createComponent(FormTeams);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
