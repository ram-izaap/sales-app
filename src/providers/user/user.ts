import { HttpClient, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';



//rxjs
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/mergeMap";
import "rxjs/add/observable/fromPromise";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

//PROVIDERS
import { AppSettingsProvider } from '../app-settings/app-settings';


//INTERFACES
import { UserOptions, SignUpOptions, profileOptions } from '../../interfaces/user';


/** 
  Generated class for the UserProvider provider.
*/

@Injectable()
export class UserProvider {
  
	// source for observable
	private authStatusSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
	
	// observable stream
	public authStatus$ = this
						.authStatusSource
						.asObservable();

	
	// source for observable
	public userInfoSource: BehaviorSubject<{ [propName: string]: any }> = new BehaviorSubject(null);
	// observable stream
	public userInfo$ = this.userInfoSource.asObservable();

	constructor(public http: HttpClient, 
				private appSettingsProvider: AppSettingsProvider,
				private ionicStorage: Storage
			) {
		console.log('Hello UserProvider Provider');
	}

	/**
	 * validateUser
	 */
	public validateUser(): Promise<any> {
		return this
				.ionicStorage
				.get('userInfo')
				.then(function (savedUserInfoFromStorage) {
					console.log("GGG::", savedUserInfoFromStorage);
					return savedUserInfoFromStorage;
				});
	}

  	/**
   * login
   */

	public login(login: UserOptions): Observable<HttpResponse<any>> {

		let apiPath: string = 'users/profiles';
		
		//prepare data
		let httpParams: HttpParams = new HttpParams()
				.set("email", login.username)
				.set("password", login.password);

		return this
				.http
				.get<HttpResponse<any>>(apiPath, {params: httpParams})
				.map(resp => {
					console.log(resp);
					let httpResponse: any = resp;
					
					
					if(httpResponse.status == 'success'){

						//trigger userInfo
						if(Array.isArray(httpResponse.data) && httpResponse.data.length){
							this.userInfoSource.next(httpResponse.data[0]);
							this.ionicStorage.set("userInfo", httpResponse.data[0]);							
						}
						
						//trigger authstatus$
						this.authStatusSource.next(true);

					}

					return httpResponse;
				});

	}

	/**
	 * updateAuthStatus
	 */
	public updateAuthStatus(status: boolean) {
		this.authStatusSource.next(status);
	}

  	/**Signup */
  	public signup(signup: SignUpOptions): Observable<HttpResponse<any>> {
	
		let apiPath: string = 'users/profiles';
	
		return this
			.http
			.put<HttpResponse<any>>(apiPath, signup);
  
    }

    public forgotPassword(email): Observable<HttpResponse<any>> {

		let apiPath: string = 'users/forget_password';

		//prepare HttpParams
		let httpParams: HttpParams = new HttpParams().set("email",email);

		return this
				.http
				.get<HttpResponse<any>>(apiPath, {params: httpParams});
    
	}
	
	/** ------------------ logout ----------------------
	 */
	public logout(): Promise<void> {
		return this
			.ionicStorage
			.clear()
			.then(() => {			
				//Trigger app.comonent subscription
				this.authStatusSource.next(false);

				//clear userinfo
				this.userInfoSource.next(null);
				
				return;
			});
	}; // end logout

	
	/** Profile Update */
	public profile(profile:profileOptions):Observable<HttpResponse<any>> {

		let apiPath: string = 'users/profiles';
	
		return this
			.http
			.post<HttpResponse<any>>(apiPath, profile);

	}
}
