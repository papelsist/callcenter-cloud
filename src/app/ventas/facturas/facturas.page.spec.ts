import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FacturasPage } from './facturas.page';

describe('FacturasPage', () => {
  let component: FacturasPage;
  let fixture: ComponentFixture<FacturasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FacturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
