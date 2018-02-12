import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';


//PROVIDERS
import { UserProvider } from '../../providers/user/user';


//INTERFACES
import { UserOptions, profileOptions } from '../../interfaces/user';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  private profileForm: FormGroup;
  public profile: profileOptions = {user_id:'',email:'', password:'', default_id:'', phone_number:''};
  private userInfo: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private userProvider: UserProvider,
    private alertController: AlertController,
    private _formBuilder: FormBuilder,
    private toastCtrl: ToastController) {

    
    this.userProvider.userInfo$.subscribe(userInfo => {
      this.userInfo = userInfo;
    });


       //Form
		this.profileForm = _formBuilder.group({
      //Default ID
      default_id: [this.userInfo.default_id,
        Validators.compose([
        Validators.required
        ])
      ],

      phone_number: [this.userInfo.phone_number,
        Validators.compose([
        Validators.required,
        Validators.minLength(10)
        ])
      ],

      email: [this.userInfo.email,
        Validators.compose([
        Validators.required/* , Validators.pattern(regexPatterns.email) */
        ])
      ],
      
      //PASSWORD
      password: [
        '', Validators.compose([
        // ,Validators.pattern(regexPatterns.password),
        Validators.required,
        Validators.minLength(6)
        ])
      ]
    }); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  
 private profileUpdate()
 {

        if (this.profileForm.invalid) {
          //Alert pop-up
          let missingCredentialsAlert = this
          .alertController
          .create({
            message: "Some profile data's missing",
            buttons: [
                        {
                          text: "Ok",
                          role: 'cancel'
                        }
                    ]
          });
          missingCredentialsAlert.present();
      }
      else
      {

          this.profile.default_id   = this.profileForm.value.default_id; 
          this.profile.phone_number = this.profileForm.value.phone_number; 
          this.profile.email        = this.profileForm.value.email; 
          this.profile.password     = this.profileForm.value.password;
          this.profile.user_id      = this.userInfo.id;
          
          this.userProvider.profile(this.profile).subscribe(resp => {
            let httpResponse: any   = resp;
            let successMessageAlert = this.alertController.create({
                                              message:httpResponse.message,
                                              buttons:[{
                                                        text:'OK',
                                                        role:'cancel'
                                                      }]
                                          });
                successMessageAlert.present(); 
           });
      }

 }

}
