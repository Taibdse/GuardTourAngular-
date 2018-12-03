import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private centerMapSource: BehaviorSubject<any>;
  centerMap: any;

  constructor(private commonService: CommonService) { 
    let center = this.commonService.CENTER_POS_MAP_VIEW;
    console.log(`service, default value ${center}`)
    this.centerMapSource = new BehaviorSubject(center);
    this.centerMap = this.centerMapSource.asObservable();
  }

  changeCenterMap(center){
    if(!center) return;
    this.centerMapSource.next(center);
  }
}
