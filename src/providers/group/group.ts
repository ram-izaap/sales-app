import { HttpClient, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

//rxjs
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/mergeMap";
import "rxjs/add/observable/fromPromise";

//PROVIDERS
import { AppSettingsProvider } from '../app-settings/app-settings';

//INTERFACES
import { GroupOptions } from '../../interfaces/group';

/*
  Generated class for the GroupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GroupProvider {

  constructor(public http: HttpClient, private appSettingsProvider: AppSettingsProvider) {
    console.log('Hello GroupProvider Provider');
  }


  public group(group: GroupOptions): Observable<HttpResponse<any>> {
    let apiPath: string = this.appSettingsProvider.getApiURL() + 'users/groups';
    return this
        .http
        .put<HttpResponse<any>>(apiPath, group);
  }
  
  
}
