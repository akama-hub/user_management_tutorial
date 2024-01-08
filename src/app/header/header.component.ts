import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  checkBoxFlag: number = 1;

  @Output() event = new EventEmitter<String>();

  onClick( ) {
    this.checkBoxFlag = this.checkBoxFlag * -1;
    this.event.emit(String(this.checkBoxFlag));
  }
}
