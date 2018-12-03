import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RouteService } from '../../../services/route.service';

@Component({
  selector: 'app-select-route-list',
  templateUrl: './select-route-list.component.html',
  styleUrls: ['./select-route-list.component.scss']
})
export class SelectRouteListComponent implements OnInit {
  @Input() all: boolean;
  @Input() type: number;
  @Input() formControlSm: boolean;
  @Output() changeEvent = new EventEmitter();
  @Output() clickEvent = new EventEmitter();

  arrRouteList: any;
  currentVal: string;
  constructor(private routeService: RouteService) { }

  ngOnInit() {
    this.getDeviceList();
  }

  change($event){
    // let val = $event.target.value;
    this.changeEvent.emit(this.currentVal);
  }

  click(){
    this.clickEvent.emit(this.currentVal);
  }

  async getDeviceList(){
    let data = await this.routeService.getRoutelist();
    console.log(data);
    if(!data) return;
    this.arrRouteList = data.slice();
    this.currentVal = '0';
    if(!this.all) this.currentVal = this.arrRouteList[0].iRouteID;
  }

}
