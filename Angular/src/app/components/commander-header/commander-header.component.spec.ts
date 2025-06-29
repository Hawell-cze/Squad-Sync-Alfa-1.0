import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommanderHeaderComponent } from './commander-header.component';

describe('CommanderHeaderComponent', () => {
  let component: CommanderHeaderComponent;
  let fixture: ComponentFixture<CommanderHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommanderHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommanderHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
