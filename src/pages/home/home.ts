import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';

//PROVIDERS
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
	
	private userInfo: any;
	
	constructor(public navCtrl: NavController, 
			public navParams: NavParams,
			private userProvider: UserProvider
	) {

		this.userProvider.userInfo$.subscribe(userInfo => {
			this.userInfo = userInfo;
		});

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad HomePage');	
	}

}
