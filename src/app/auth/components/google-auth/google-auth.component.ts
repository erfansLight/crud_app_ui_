import { Component, inject, OnInit } from '@angular/core';
import { TokenService } from '../../../shared/services/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

declare const google: any;

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.css'],
})
export class GoogleAuthComponent implements OnInit {
  private clientId = '589508980994-3fcpoc9vge5kjrnqocvuhqi88spu8lhr.apps.googleusercontent.com';
  isLoginInProgress = false;

  private tokenService: TokenService = inject(TokenService);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);

  ngOnInit(): void {
    this.loadGoogleButton();
  }

  private loadGoogleButton() {
    if (!google || !google.accounts) {
      console.error('Google API not loaded yet');
      return;
    }

    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => this.handleGoogleResponse(response),
      auto_select: false,
    });

    google.accounts.id.renderButton(
      document.getElementById('googleSignInButton'),
      { theme: 'outline', size: 'large', text: 'signin_with' }
    );
  }

  private handleGoogleResponse(response: any) {
    const googleToken = response.credential;
    if (!googleToken) return;

    this.isLoginInProgress = true;

    this.authService.googleLogin(googleToken).subscribe({
      next: (res: any) => {
        if (res && res.token && res.user) {
          this.tokenService.storeToken(res.token);

          const role = this.tokenService.getUserRole(res.token) || res.user.role;

          // Redirect based on role
          if (role === 'admin') {
            this.router.navigate(['/admin'], { replaceUrl: true });
          } else {
            this.router.navigate(['/main-page'], { replaceUrl: true });
          }
        } else {
          console.error('Login failed: invalid response', res);
        }
        this.isLoginInProgress = false;
      },
      error: (err) => {
        console.error('Google login error:', err);
        this.isLoginInProgress = false;
      }
    });
  }
}
