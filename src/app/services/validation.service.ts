import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  checkNotEmpty(val){
    if(val == null || val == undefined) return false;
    if((val + '').trim() == '') return false;
    return true;
  }

  checkPositiveNum(val){
    if(!this.checkNotEmpty(val)) return false;
    if(isNaN(val)) return false;
    if(Number(val) > 0) return true;
  }

  
}
