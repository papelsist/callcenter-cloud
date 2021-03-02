import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PromocionesPage } from './promociones.page';

describe('PromocionesPage', () => {
  let component: PromocionesPage;
  let fixture: ComponentFixture<PromocionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromocionesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PromocionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
