import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionListModalComponent } from './session-list-modal.component';

describe('SessionListModalComponent', () => {
  let component: SessionListModalComponent;
  let fixture: ComponentFixture<SessionListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionListModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
