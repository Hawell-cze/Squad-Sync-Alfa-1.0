import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserShipCardComponent } from './user-ship-card.component';

describe('UserShipCardComponent', () => {
  let component: UserShipCardComponent;
  let fixture: ComponentFixture<UserShipCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserShipCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserShipCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
