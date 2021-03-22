import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AutorizadasPage } from './autorizadas.page';

describe('AutorizadasPage', () => {
  let component: AutorizadasPage;
  let fixture: ComponentFixture<AutorizadasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutorizadasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AutorizadasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
