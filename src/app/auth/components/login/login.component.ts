import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { AuthService } from '../../shared/services/auth.service';
import { GoogleAuthComponent } from "../google-auth/google-auth.component";

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, LoadingSpinnerComponent, GoogleAuthComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isEmpty = false;
  isInValid = false;
  isFocused = false;
  value = '';
  loading = false;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService)

  loginForm: FormGroup = new FormGroup({});
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      EmailInput: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.isInValid = true;
      return;
    }

    this.isInValid = false;
    this.loading = true;
    const email = this.value;

    this.authService.login(email).subscribe({
      next: (res) => {
        const { data, message } = res;
        localStorage.setItem('email', email);
        localStorage.setItem('token', data);
        localStorage.setItem('state', message);
        this.router.navigate(['/auth/verify']);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  onchange(event: any) {
    this.value = event.target.value;
    if (this.value.trim() == '') this.isEmpty = true;
    else {
      this.isEmpty = false;
    }
  }
}
