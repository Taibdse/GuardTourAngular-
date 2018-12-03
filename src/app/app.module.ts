//modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA  } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { DatetimePopupModule } from 'ngx-bootstrap-datetime-popup';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { NgxPaginationModule } from 'ngx-pagination';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMaterialModule } from './ngMaterial.module';

import { NgxSortableModule } from 'ngx-sortable'


// services
import { CommonService } from '../app/services/common.service';
import { ValidationService } from '../app/services/validation.service';
import { GuardService } from '../app/services/guard.service';
import { GuardGroupService } from '../app/services/guard-group.service';
import { DeviceService } from '../app/services/device.service';
import { AssetService } from '../app/services/asset.service';
import { TourService } from '../app/services/tour.service';
import { ZoneService } from '../app/services/zone.service';
import { RouteService } from '../app/services/route.service';
import { PointService } from '../app/services/point.service';
import { IncidentService } from '../app/services/incident.service';
import { ReportService } from '../app/services/report.service';
import { GoogleMapService } from '../app/services/google-map.service';
import { ChartService } from '../app/services/chart.service';
import { TimeService } from '../app/services/time.service';

// components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/app-components/navbar/navbar.component';
import { GuardMainTableComponent } from './components/guard-components/guard-main-table/guard-main-table.component';

// select components
import { SelectGroupListComponent } from './components/select-components/select-group-list/select-group-list.component';
import { SelectIncidentListComponent } from './components/select-components/select-incident-list/select-incident-list.component';
import { SelectZoneListComponent } from './components/select-components/select-zone-list/select-zone-list.component';
import { SelectRouteListComponent } from './components/select-components/select-route-list/select-route-list.component';
import { SelectGuardListComponent } from './components/select-components/select-guard-list/select-guard-list.component';
import { SelectDeviceListComponent } from './components/select-components/select-device-list/select-device-list.component';
import { SelectMonthComponent } from './components/select-components/select-month/select-month.component';
import { SelectWeekComponent } from './components/select-components/select-week/select-week.component';
import { SelectYearComponent } from './components/select-components/select-year/select-year.component';

// alert components
import { AlertSuccessComponent } from './components/alert-components/alert-success/alert-success.component';
import { AlertErrorComponent } from './components/alert-components/alert-error/alert-error.component';
import { AlertWarningComponent } from './components/alert-components/alert-warning/alert-warning.component';

// pages

//index pages
import { MainViewComponent } from './pages/main-view/main-view.component';


// live pages
import { LiveTourComponent } from './pages/live-tour/live-tour.component';
import { LiveIncidentComponent } from './pages/live-incident/live-incident.component';
import { LiveAttendanceComponent } from './pages/live-attendance/live-attendance.component';

// setting pages
import { SettingCheckPointComponent } from './pages/setting-check-point/setting-check-point.component';
import { SettingGroupGuardComponent } from './pages/setting-group-guard/setting-group-guard.component';
import { SettingSecurityGuardProfileComponent } from './pages/setting-security-guard-profile/setting-security-guard-profile.component';
import { SettingZoneComponent } from './pages/setting-zone/setting-zone.component';
import { SettingRouteComponent } from './pages/setting-route/setting-route.component';
import { SettingScheduleComponent } from './pages/setting-schedule/setting-schedule.component';
import { SettingAssetComponent } from './pages/setting-asset/setting-asset.component';
import { SettingDeviceComponent } from './pages/setting-device/setting-device.component';
import { SettingIncidentComponent } from './pages/setting-incident/setting-incident.component';

// report pages
import { DailyReportComponent } from './pages/daily-report/daily-report.component';
import { ReportWeekOrMonthComponent } from './pages/report-week-or-month/report-week-or-month.component';
import { ReportPatrollingComponent } from './pages/report-patrolling/report-patrolling.component';
import { HistoryTourComponent } from './pages/history-tour/history-tour.component';
import { HistoryIncidentsComponent } from './pages/history-incidents/history-incidents.component';
import { ReportIncidentsComponent } from './pages/report-incidents/report-incidents.component';
import { HistoryAttendanceComponent } from './pages/history-attendance/history-attendance.component';
import { AttendanceReportGuardComponent } from './pages/attendance-report-guard/attendance-report-guard.component';
import { AttendanceReportDeviceComponent } from './pages/attendance-report-device/attendance-report-device.component';
import { AttendanceReportGroupComponent } from './pages/attendance-report-group/attendance-report-group.component'

import { GuardMainViewGooglemapComponent } from './components/guard-components/guard-main-view-googlemap/guard-main-view-googlemap.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    GuardMainTableComponent,
    SelectGroupListComponent,
    MainViewComponent,
    AlertSuccessComponent,
    AlertErrorComponent,
    AlertWarningComponent,
    GuardMainViewGooglemapComponent,
    SettingCheckPointComponent,
    SettingGroupGuardComponent,
    SettingSecurityGuardProfileComponent,
    SettingZoneComponent,
    SettingRouteComponent,
    SettingScheduleComponent,
    SettingAssetComponent,
    SettingDeviceComponent,
    SettingIncidentComponent,
    LiveTourComponent,
    LiveIncidentComponent,
    LiveAttendanceComponent,
    SelectRouteListComponent,
    SelectGuardListComponent,
    SelectDeviceListComponent,
    SelectIncidentListComponent,
    SelectZoneListComponent,
    DailyReportComponent,
    ReportWeekOrMonthComponent,
    SelectMonthComponent,
    SelectWeekComponent,
    SelectYearComponent,
    ReportPatrollingComponent,
    HistoryTourComponent,
    HistoryIncidentsComponent,
    ReportIncidentsComponent,
    HistoryAttendanceComponent,
    AttendanceReportGuardComponent,
    AttendanceReportDeviceComponent,
    AttendanceReportGroupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    HttpClientModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    DatetimePopupModule,
    AngularDateTimePickerModule,
    NgxPaginationModule,
    // BrowserAnimationsModule,
    NgMaterialModule,
    NgxSortableModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [
    CommonService,
    GuardService,
    ValidationService,
    GuardGroupService,
    DeviceService,
    AssetService,
    TourService,
    ZoneService,
    RouteService,
    PointService,
    IncidentService,
    ReportService,
    GoogleMapService,
    ChartService,
    TimeService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
