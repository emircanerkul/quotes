import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ColorModule } from 'src/app/modules/color/color.module';
import { AuthService } from 'src/app/service/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { take, catchError } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { of } from 'rxjs';

@Component({
  selector: 'app-profile-background',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './profile-background.component.html',
  styles: [
    'app-profile-background ion-avatar {margin: 10px auto; width: 96px; height: 96px;}',
    'app-profile-background div {text-align: center; height: 100%;}',
    'app-profile-background ion-label {font-size: 16pt;}',
    'app-profile-background ion-input {font-size: 10pt!important; background-color: #00000080!important; margin: 10px 0; border-radius: 15px; --padding-end: 10px!important;}',
    'app-profile-background ion-chip {margin-top: 10px;background-color: #00000080;color: white;height: 35px;}'
  ]
})
export class ProfileBackgroundComponent {
  @Input() color;
  canRefreshBackgroundColor: boolean = true;

  constructor(
    public colorModule: ColorModule,
    private auth: AuthService,
    private afStore: AngularFirestore,
    private toastController: ToastController
  ) {}

  refreshBackgroundColor() {
    this.canRefreshBackgroundColor = false;

    this.auth.user$.pipe(take(1)).subscribe(
      (e) => {
        let color;
        do {
          color = this.colorModule.getRandomColor();
        } while (color == e.color || color == undefined);

        this.afStore
          .collection('users')
          .doc(e.uid)
          .update({ color })
          .catch((e) => {
            this.canRefreshBackgroundColor = true;
            console.log(e);
            return;
          })
          .finally(() => {
            setTimeout(() => (this.canRefreshBackgroundColor = true), 10000);
            this.toastController
              .create({
                message: 'Background Changed!',
                duration: 1000
              })
              .then((e) => e.present());
          });
      },
      catchError((err) => {
        this.canRefreshBackgroundColor = true;
        throw 'error in source. Details: ' + err;
      })
    );
    return;
  }
}
