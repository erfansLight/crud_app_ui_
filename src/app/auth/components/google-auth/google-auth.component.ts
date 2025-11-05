import { Component } from '@angular/core';

@Component({
  selector: 'app-google-auth',
  imports: [],
  templateUrl: './google-auth.component.html',
  styleUrl: './google-auth.component.css'
})
export class GoogleAuthComponent {

  onGoogleLogin() {
  console.log("Google login clicked!");
}

}
