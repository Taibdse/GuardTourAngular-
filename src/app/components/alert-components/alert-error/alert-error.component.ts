import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-alert-error',
  templateUrl: './alert-error.component.html',
  styleUrls: ['./alert-error.component.scss']
})
export class AlertErrorComponent implements OnInit {
  @Input() content: string;
  @Input() detail: string;
  @ViewChild('modalError') modalError;
   
  constructor() { }

  ngOnInit() {
  }

}
