import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransportesPage } from './transportes.page';

describe('TransportesPage', () => {
  let component: TransportesPage;
  let fixture: ComponentFixture<TransportesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransportesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
