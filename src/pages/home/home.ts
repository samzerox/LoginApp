import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UsuarioProvider, Credenciales } from '../../providers/usuario/usuario';

import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: Credenciales = {};

  constructor(public navCtrl: NavController,
              private afAuth: AngularFireAuth,
              public usuarioProv: UsuarioProvider) {
    console.log( this.usuarioProv.usuario );

    this.user = this.usuarioProv.usuario;

    this.afAuth.authState.subscribe( user => {
      console.log('AFAUTH!!!');
      console.log(JSON.stringify(user) );
      
    });
    
  }

  salir() {
    this.afAuth.auth.signOut().then( res => {
      this.usuarioProv.usuario = {};
      this.navCtrl.setRoot(LoginPage);
    });
  }

}
