import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CartItemPage } from './cart-item.page';

describe('CartItemPage', () => {
  let component: CartItemPage;
  let fixture: ComponentFixture<CartItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartItemPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CartItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
