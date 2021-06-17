import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PedidoViewPage } from './pedido-view.page';

describe('PedidoViewPage', () => {
  let component: PedidoViewPage;
  let fixture: ComponentFixture<PedidoViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PedidoViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
