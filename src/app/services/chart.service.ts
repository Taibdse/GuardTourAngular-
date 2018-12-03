import { Injectable } from '@angular/core';
import Chart from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  createChart(ctx, type, data, options){
    return new Chart(ctx, { type, data, options });
  }
  getColorVsBgColor(length){
    let arrBgColor1 = [];
    let arrBorderColor1 = [];
    let arrBgColor2 = [];
    let arrBorderColor2 = [];
  
    let bgColor1 = 'rgba(255, 99, 132, 0.2)';
    let borderColor1 = 'rgba(255,99,132,1)';
    let bgColor2 = 'rgba(255, 159, 64, 0.2)';
    let borderColor2 = 'rgba(255, 159, 64, 1)';
  
    for(let i = 0; i < length; i++){
      arrBgColor1.push(bgColor1);
      arrBorderColor1.push(borderColor1);
      arrBgColor2.push(bgColor2);
      arrBorderColor2.push(borderColor2);
    }
  
    return { arrBgColor1, arrBorderColor1, arrBgColor2, arrBorderColor2 };
  }
}
