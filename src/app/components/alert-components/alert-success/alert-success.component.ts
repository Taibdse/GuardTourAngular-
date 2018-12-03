import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-alert-success',
  templateUrl: './alert-success.component.html',
  styleUrls: ['./alert-success.component.scss']
})
export class AlertSuccessComponent implements OnInit {
  @Input() content: string;
  @Input() detail: string;
  @ViewChild('modalSuccess') modalSuccess;
  constructor() { }

  ngOnInit() {
  }

}
