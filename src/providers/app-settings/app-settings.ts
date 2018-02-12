import { Injectable } from '@angular/core';


@Injectable()
export class AppSettingsProvider {

  private apiURL: string = 'http://162.144.41.156/~izaapinn/HMGPS-API/';
  constructor() {}

  /**
   * getApiURL
   */
  public getApiURL() {
    return this.apiURL;
  }




}
