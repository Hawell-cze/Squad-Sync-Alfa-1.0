import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterModule } from '@angular/router';

@Component({
  selector: 'app-commander-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './commander-header.component.html',
  styleUrls: ['./commander-header.component.css']
})
export class CommanderHeaderComponent {
  @Input() total: number = 0;
  @Input() active: number = 0;
  @Input() enroute: number = 0;
  @Input() destroyed: number = 0;
  @Input() enemy: string = '';

  constructor ( private router: Router) {}

  onClickLogo() {
    this.router.navigate(["/home"]);
  }
}
