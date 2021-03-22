import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RechazadasPage } from './rechazadas.page';

describe('RechazadasPage', () => {
  let component: RechazadasPage;
  let fixture: ComponentFixture<RechazadasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechazadasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RechazadasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
