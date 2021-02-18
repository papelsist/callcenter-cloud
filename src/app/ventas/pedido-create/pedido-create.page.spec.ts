import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PedidoCreatePage } from './pedido-create.page';

describe('PedidoCreatePage', () => {
  let component: PedidoCreatePage;
  let fixture: ComponentFixture<PedidoCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PedidoCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
