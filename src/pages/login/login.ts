import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { HomePage } from '../home/home';

import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

import { GooglePlus } from '@ionic-native/google-plus';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, 
              private afAuth: AngularFireAuth,
              public usuarioProv: UsuarioProvider,
              private fb: Facebook,
              private googlePlus: GooglePlus,
              private platform: Platform) {
  }

  signInGoogle() {
    this.googlePlus.login({
      'webClientId': '628665298543-ijp7g40c9a1ee2mb7d6tke8vh2hgk031.apps.googleusercontent.com',
      'offline': true
    }).then( res => {
      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
      .then( user => {
        console.log(JSON.stringify(user));

                  this.usuarioProv.cargarUsuario(
                    user.displayName,
                    user.email,
                    user.photoURL,
                    user.uid,
                    'google'
                  );
                  
                  this.navCtrl.setRoot(HomePage);
      })
      .catch( error => console.log("Firebase failure: " + JSON.stringify(error)));
    }).catch(err => console.error("Error: " + JSON.stringify(err)));
  }

  signInWithFacebook() {

    if (this.platform.is('cordova')) {
      // Celular
       this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
         firebase.auth().signInWithCredential(facebookCredential)
               .then( user => {
                  console.log(user);

                  this.usuarioProv.cargarUsuario(
                    user.displayName,
                    user.email,
                    user.photoURL,
                    user.uid,
                    'facebook'
                  );
                  
                  this.navCtrl.setRoot(HomePage);
               }).catch( e => console.log('Error con el login' + JSON.stringify(e)));
      })

    } else {
      // Escritorio
      
      this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(res => {
        console.log(res);
        let user = res.user;
        this.usuarioProv.cargarUsuario(
          user.displayName,
          user.email,
          user.photoURL,
          user.uid,
          'facebook'
        );
        
        this.navCtrl.setRoot(HomePage);
      });

    }


    
  }


}
