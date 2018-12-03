import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainViewComponent } from './pages/main-view/main-view.component';
import { LiveTourComponent } from './pages/live-tour/live-tour.component';
import { LiveIncidentComponent } from './pages/live-incident/live-incident.component';
import { LiveAttendanceComponent } from './pages/live-attendance/live-attendance.component';

import { SettingIncidentComponent } from './pages/setting-incident/setting-incident.component';
import { SettingDeviceComponent } from './pages/setting-device/setting-device.component';
import { SettingAssetComponent } from './pages/setting-asset/setting-asset.component';
import { SettingZoneComponent } from './pages/setting-zone/setting-zone.component';
import { SettingGroupGuardComponent } from './pages/setting-group-guard/setting-group-guard.component';
import { SettingSecurityGuardProfileComponent } from './pages/setting-security-guard-profile/setting-security-guard-profile.component';
import { SettingCheckPointComponent } from './pages/setting-check-point/setting-check-point.component';
import { SettingRouteComponent } from './pages/setting-route/setting-route.component';

import { DailyReportComponent } from './pages/daily-report/daily-report.component';
import { ReportWeekOrMonthComponent } from './pages/report-week-or-month/report-week-or-month.component';
import { ReportPatrollingComponent } from './pages/report-patrolling/report-patrolling.component';
import { HistoryTourComponent } from './pages/history-tour/history-tour.component';
import { HistoryIncidentsComponent } from './pages/history-incidents/history-incidents.component';
import { ReportIncidentsComponent } from './pages/report-incidents/report-incidents.component';
import { HistoryAttendanceComponent } from './pages/history-attendance/history-attendance.component';
import { AttendanceReportGuardComponent } from './pages/attendance-report-guard/attendance-report-guard.component';
import { AttendanceReportDeviceComponent } from './pages/attendance-report-device/attendance-report-device.component';
import { AttendanceReportGroupComponent } from './pages/attendance-report-group/attendance-report-group.component';

const routes: Routes = [
  { path: '', component: MainViewComponent },
  
  { path: 'live-tour', component: LiveTourComponent },
  { path: 'live-incident', component: LiveIncidentComponent },
  { path: 'live-attendance', component: LiveAttendanceComponent },

  { path: 'setting-incident', component: SettingIncidentComponent },
  { path: 'setting-device', component: SettingDeviceComponent },
  { path: 'setting-asset', component: SettingAssetComponent },
  { path: 'setting-zone', component: SettingZoneComponent },
  { path: 'setting-group', component: SettingGroupGuardComponent },
  { path: 'setting-point', component: SettingCheckPointComponent },
  { path: 'setting-route', component: SettingRouteComponent },
  { path: 'setting-guard', component: SettingSecurityGuardProfileComponent },

  { path: 'report-daily', component: DailyReportComponent },
  { path: 'report-week-or-month', component: ReportWeekOrMonthComponent },
  { path: 'report-patrolling', component: ReportPatrollingComponent },
  { path: 'history-tour', component: HistoryTourComponent },
  { path: 'history-incident', component: HistoryIncidentsComponent },
  { path: 'report-incident', component: ReportIncidentsComponent },
  { path: 'history-attendance', component: HistoryAttendanceComponent },
  { path: 'attendance-report-guard', component: AttendanceReportGuardComponent },
  { path: 'attendance-report-device', component: AttendanceReportDeviceComponent },
  { path: 'attendance-report-group', component: AttendanceReportGroupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
