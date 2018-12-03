import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert-warning',
  templateUrl: './alert-warning.component.html',
  styleUrls: ['./alert-warning.component.scss']
})
export class AlertWarningComponent implements OnInit {
  @Input() content: string;
  @Input() detail: string;
  @Input() type: number = 1;
  @ViewChild('modalWarning') modalWarning;
  @Output() confirmEvent = new EventEmitter();
  @Output() rejectEvent = new EventEmitter();
  @Output() acceptEvent = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  emitConfirmEvent(){
    this.confirmEvent.emit();
  }

  emitRejectEvent(){
    this.rejectEvent.emit();
  }

  emitAcceptEvent(){
    this.acceptEvent.emit();
  }

}
