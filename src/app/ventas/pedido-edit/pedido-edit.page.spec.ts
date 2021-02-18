import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PedidoEditPage } from './pedido-edit.page';

describe('PedidoEditPage', () => {
  let component: PedidoEditPage;
  let fixture: ComponentFixture<PedidoEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PedidoEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
