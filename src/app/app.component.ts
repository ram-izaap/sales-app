import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//PLUGINS
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//PROVIDERS
import { UserProvider } from '../providers/user/user';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //Default root page
  public rootPage: any = 'LoginPage';

  public pages: Array<{title: string, component: string}>;

  constructor(public platform: Platform, 
				public statusBar: StatusBar, 
				public splashScreen: SplashScreen,
				private userProvider: UserProvider,
				private ionicStorage: Storage,
				private loadingController: LoadingController,
				private menuController: MenuController
			) {
	
	// if user enters from login/signup/app in background
	this.userProvider.authStatus$.subscribe(authStatus => {
		if(authStatus === true){
			this.nav.setRoot("HomePage");
		}
	});	

	this
		.ionicStorage
		.ready()
		.then(() => {
			//Now validate User
			this
				.userProvider
				.validateUser()
				.then(savedUserInfo => {
					if(null === savedUserInfo){
						this.nav.setRoot("LoginPage");
						this.platformReady();
					}
					else{
						this.userProvider.userInfoSource.next(savedUserInfo);
						this.userProvider.updateAuthStatus(true);
					}
				});
		});
	
    // used for an example of ngFor and navigation
    this.pages = [
       { title: 'Home', component: 'HomePage' },
       { title: 'Profile', component: 'ProfilePage' }
    ];

  }

  private platformReady(): void {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
	});
	
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  private logout(): void{

	let logoutLoading = this
      .loadingController
      .create({ content: "Goodbye ..." });
	logoutLoading.present();
	
	setTimeout(() => {
		this
		  .userProvider
		  .logout()
		  .then(() => {
			this
			  .menuController
			  .enable(false);
			
			this.nav.setRoot("LoginPage").then(() => {
			  //this.userProvider.
			});
  
		  });
		logoutLoading.dismiss();
	  }, 2000);
  }
}
