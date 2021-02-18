import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VentasTabPage } from './ventas-tab.page';

describe('VentasTabPage', () => {
  let component: VentasTabPage;
  let fixture: ComponentFixture<VentasTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasTabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VentasTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
