import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TokenService } from '../../../../shared/services/token.service';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { ErrorToastComponent } from '../../error-toast/error-toast.component';
import { InputNameComponent } from '../input-name/input-name.component';
import { InputPasswordComponent } from '../input-password/input-password.component';
import { InputPhoneComponent } from '../input-phone/input-phone.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    LoadingSpinnerComponent,
    ErrorToastComponent,
    InputNameComponent,
    InputPasswordComponent,
    InputPhoneComponent,
    ModalComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  @Input() modal_open = false;

  // token = localStorage.getItem('token');
  email = localStorage.getItem('email');

  username = '';
  password = '';
  phonenumber = '';
  existingUser = false;
  error_text = 'User with this email or phone numer already registered !';
  loading = false;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  private tokenService: TokenService = inject(TokenService);
  private authService: AuthService = inject(AuthService);

  registerForm: FormGroup = new FormGroup({});

  get nameControl(): FormControl {
    return this.registerForm.get('nameInput') as FormControl;
  }
  get passwordControl(): FormControl {
    return this.registerForm.get('passwordInput') as FormControl;
  }
  get phoneControl(): FormControl {
    return this.registerForm.get('phoneNumberInput') as FormControl;
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      nameInput: ['', [Validators.required, Validators.minLength(5)]],
      passwordInput: [
        '',
        [
          Validators.required,
          // Validators.pattern(
          //   '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[!@#$%^&*]).*$'
          // ),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,32}$'
          ),
          Validators.minLength(8),
        ],
      ],
      phoneNumberInput: [
        '',
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern('(09)[0-9]{9}'),
        ],
      ],
    });
  }
  onInput(event: Event, index: number) {
    const value = (event.target as HTMLInputElement).value;
    switch (index) {
      case 0:
        this.username = value;
        break;
      case 1:
        this.password = value;
        break;
      case 2:
        this.phonenumber = value;
        break;
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.error_text =
        'All fields are required. Complete the form to continue.';
      this.showError();
      return;
    }

    this.loading = true;

    this.authService
      .register(this.username, this.email!, this.password, this.phonenumber)
      .subscribe({
        next: (res) => {
          const { data } = res;
          this.tokenService.storeToken(data);
          localStorage.removeItem('state');
          localStorage.removeItem('email');
          this.router.navigate(['main-page'], { replaceUrl: true });
        },
        error: (err) => {
          this.loading = false;
          const { status } = err;
          if (status == 409) {
            this.error_text =
              'User with this email or phone number already registered!';
          } else {
            this.error_text = 'Something went wrong!';
          }
          this.showError();
        },
      });
  }

  private showError() {
    this.existingUser = true;
    setTimeout(() => (this.existingUser = false), 3000);
  }
}
