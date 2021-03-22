import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BancoFieldComponent } from './banco-field.component';

describe('BancoFieldComponent', () => {
  let component: BancoFieldComponent;
  let fixture: ComponentFixture<BancoFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BancoFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BancoFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
