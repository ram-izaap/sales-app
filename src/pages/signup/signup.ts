import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';

//PROVIDERS
import { UserProvider } from '../../providers/user/user';
import { GroupProvider } from '../../providers/group/group';

//INTERFACES
import { SignUpOptions } from '../../interfaces/user';

import { GroupOptions } from '../../interfaces/group';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  private _signUpForm: FormGroup;
  private _guestForm: FormGroup;
  private passwordInputType: string = "password";
  public signup: SignUpOptions = {email:'', password:'', default_id:'', phone_number:'',type:'USER'};
  public group: GroupOptions = {  user_id:'', 
                                  join_key:'',
                                  name:'',
                                  password:'',
                                  protection_type:'',
                                  location_type:'',
                                  latitude:'',
                                  longitude:'',
                                  type:'',
                                  created_id:'',
                                  updated_id:''
                                };
  public submitted:boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private userProvider: UserProvider,
    private alertController: AlertController,
    private groupProvider: GroupProvider,
    private _formBuilder: FormBuilder,
    private toastCtrl: ToastController
  ) {

    //Guest Registeration
    this._guestForm = _formBuilder.group({
        guest_id: ["",
          Validators.compose([
          Validators.required
          ])
        ]
    });

    //Form
		this._signUpForm = _formBuilder.group({
        //Default ID
        default_id: ["",
          Validators.compose([
          Validators.required
          ])
        ],

        phone_number: ["",
          Validators.compose([
          Validators.required,
          Validators.minLength(10)
          ])
        ],

        email: ["",
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
 

  private register(){

    if (this._signUpForm.invalid) {
              //Alert pop-up
              let missingCredentialsAlert = this
              .alertController
              .create({
                message: "Some credentials are missing",
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

        this.signup.default_id   = this._signUpForm.value.default_id; 
        this.signup.phone_number = this._signUpForm.value.phone_number; 
        this.signup.email        = this._signUpForm.value.email; 
        this.signup.password     = this._signUpForm.value.password;
        this.doRegister();

    }   
  
  }

  guest(){
            if (this._guestForm.invalid) {
                  //Alert pop-up
                  let missingCredentialsAlert = this
                  .alertController
                  .create({
                    message: "Guest Id missing",
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
              this.signup.default_id   = this._guestForm.value.guest_id; 
              this.signup.phone_number = this._guestForm.value.guest_id; 
              this.signup.type         = 'GUEST'; 
              this.signup.email        =  ''; 
              this.signup.password     =  '';
              this.doRegister();
            }
  }
  
  
  doRegister(){

        this.userProvider.signup(this.signup).subscribe(resp => {
            let httpResponse: any   = resp;
            let successMessageAlert = this.alertController.create({
                                              message:httpResponse.message,
                                              buttons:[{
                                                        text:'OK',
                                                        role:'cancel'
                                              }]
                                          });
                successMessageAlert.present(); 


                this.group.user_id         = httpResponse.user_id;
                this.group.type            = 'private';
                this.group.password        = '';
                this.group.protection_type = 'NORMAL';
                this.group.latitude        = '';
                this.group.longitude       = '';
                this.group.location_type   = 'DYNAMIC';
                this.group.created_id      = httpResponse.user_id;
                this.group.updated_id      = httpResponse.user_id;

              if(httpResponse.status == 'success'){

                //create groups default id & phonenumber
                this.group.name            = this.signup.default_id;
                this.group.join_key        = this.signup.default_id;
                this.groupProvider.group(this.group).subscribe(resp => {
                  console.log(resp);
                });

                if( this.signup.phone_number !== this.signup.default_id){
                  this.group.name            = this.signup.phone_number;
                  this.group.join_key        = this.signup.phone_number;
                  this.groupProvider.group(this.group).subscribe(resp => {
                        console.log(resp);
                    });
               }

                  this.navCtrl.push('LoginPage');
              }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  login(){
    this.navCtrl.push('LoginPage');
  }

}
