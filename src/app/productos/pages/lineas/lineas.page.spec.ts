import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LineasPage } from './lineas.page';

describe('LineasPage', () => {
  let component: LineasPage;
  let fixture: ComponentFixture<LineasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LineasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
