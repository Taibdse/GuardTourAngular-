import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  
  APP_DOMAIN = 'http://115.79.27.219/tracking/';

  CENTER_POS_MAP_VIEW = [20.81715284, 106.77411238];

  arrMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  arrColors = [ '#8d6e63', '#616161', '#78909c', '#ffb74d', '#66bb6a', '#80d8ff', '#00acc1', '#5c6bc0', '#f48fb1', '#e1bee7', 'red', 'green', 'blue','orange','violet', 'yellow', 'pink', 'purple', 'cyan', 'teal', 'lime', 'ambe', '#0048BA', '#B0BF1A', '#7CB9E8', '#72A0C1', '#F2F0E6', '#9966CC', '#E32636', '#C46210', '#EFDECD', '#FFBF00', '#CFCFCF', '#551B8C', '#F2B400', '#CD9575', '#665D1E', '#915C83', '#841B2D', '#008000', '#8DB600', '#FBCEB1', '#00FFFF', '#D0FF14', '#4B5320', '#8F9779', '#E9D66B', '#B2BEB5', '#87A96B', '#FF9966' ];

  arrCriteriaReport = [
    'Time per Route (min)',
    'Expected Executed Routes (13hrs)',
    'Actual Executed Routes',
    'Time spent on resolving non-conformities (minutes)',
    'Missed routes due to resolving non-conformities',
    'Corrected Executed Routes',
    'Performance Routes (%)',
    'Successful routes within time schedule',
    'Performance Timing (%)',
    'Successful routes with correct routing',
    'Performance Routing (%)',
    'Routing Mistakes',
    'Overall performance (%)',
    'Number of reports issued',
    'Actual Patrolling Time (min)',
    'Allowed Interval between trip',
    'Total patroling time in minutes',
    'Perfomance Time %',
    'Total Idling Time (min)',
    'Idling Time in %',
  ]

  arrReportCal = [1, 2, 3, 4, '5  =4:1', '6=3+5', '7=6:2', 8, '9=8:3', 10, '11=6:3', '', '12=7*9*11', 13, 14, 15, 16, 17, 18, 19];

  arrPropsReport = ['iTime_per_Route', 'iExpected_Executed_Routes', 'iActual_Executed_Routes', 'iTime_spent_on_resolving_non_conformities', 'iMissed_routes_due_to_resolving_non_conformities', 'iCorrected_Executed_Routes', 'dPerformance_Routes', 'iSuccessful_routes_within_time_schedule', 'dPerformance_Timing', 'iSuccessful_routes_with_correct_routing', 'dPerformance_Routing', 'iRouting_Mistakes', 'dOverall_performance', 'iNumber_of_reports_issued', 'iActual_Patrolling_Time', 'iAllowed_Interval_between_trip', 'iTotal_patroling_time_in_minutes', 'dPerfomance_Time', 'iTotal_Idling_Time', 'dIdling_Time_in'];

  unitsOfData = ['min', '', '', 'min', '', '', '%', '', '%','', '%', '', '%', '','min', 'min', 'min', '%', 'min', '%'];

  constructor() {
   
  }

  handleData(data: any){
    if (!data) return null;
    if (!Array.isArray(data)) return null;
    if (data.length == 0) return null;
    return data;
  }

  handleError(error){
    console.log(error.message);
    return null;
  }

  removeUnicode(str){
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

}
