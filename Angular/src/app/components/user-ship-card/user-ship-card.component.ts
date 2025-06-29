import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-ship-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-ship-card.component.html',
  styleUrls: ['./user-ship-card.component.css'],
})
export class UserShipCardComponent {
  @Input() member: any; // celý objekt člena (obsahuje např. nickname a status)
  @Output() cardClick: EventEmitter<any> = new EventEmitter<any>();

  // Dynamická barva rámečku podle statusu
  get borderColor(): string {
    const status = this.member?.status;
    if (status === 'JOINED') {
      return '#32CD32';
    } else if (status === 'PENDING') {
      return '#FFA500';
    } else {
      return '#FF4500';
    }
  }

  onClick(): void {
    this.cardClick.emit(this.member);
  }
}
