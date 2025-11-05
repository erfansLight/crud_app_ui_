import {
  Component,
  ElementRef,
  inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule, PlatformLocation } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { TokenService } from '../../../shared/services/token.service';
import { RegisterComponent } from '../registerComponents/register/register.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { filter } from 'rxjs';
import { ErrorToastComponent } from '../error-toast/error-toast.component';
import { AuthService } from '../../shared/services/auth.service';
@Component({
  selector: 'app-verify',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    RegisterComponent,
    LoadingSpinnerComponent,
    ErrorToastComponent,
  ],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css',
})
export class VerifyComponent {
  mail = localStorage.getItem('email');
  token = localStorage.getItem('token');
  state = localStorage.getItem('state');

  text: string = '';
  value = new Array(6);
  code: string = '';
  show: boolean = false;
  hover = false;
  use_password = false;
  time = 180;
  Labeltimer = '';
  modalOpen = false;
  loading: boolean = false;
  error_text = 'The entered code is incorrect !';
  index = [0, 1, 2, 3, 4, 5];

  private formBuilder: FormBuilder = inject(FormBuilder);
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  private tokenService: TokenService = inject(TokenService);
  private authService: AuthService = inject(AuthService);

  verifyForm: FormGroup = new FormGroup({});
  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: any) => {
        if (event.navigationTrigger === 'popstate') {
          this.cleanup();
        }
      });

    this.verifyForm = this.formBuilder.group({
      verifyNum1: [
        '',
        [
          Validators.required,
          Validators.maxLength(1),
          Validators.pattern('[0-9]'),
        ],
      ],
      verifyNum2: [
        '',
        [
          Validators.required,
          Validators.maxLength(1),
          Validators.pattern('[0-9]'),
        ],
      ],
      verifyNum3: [
        '',
        [
          Validators.required,
          Validators.maxLength(1),
          Validators.pattern('[0-9]'),
        ],
      ],
      verifyNum4: [
        '',
        [
          Validators.required,
          Validators.maxLength(1),
          Validators.pattern('[0-9]'),
        ],
      ],
      verifyNum5: [
        '',
        [
          Validators.required,
          Validators.maxLength(1),
          Validators.pattern('[0-9]'),
        ],
      ],
      verifyNum6: [
        '',
        [
          Validators.required,
          Validators.maxLength(1),
          Validators.pattern('[0-9]'),
        ],
      ],
    });

    if (this.state == '1') {
      this.text = `enter the code sended to email <${this.mail}>`;
      this.use_password = true;
    } else {
      this.text = `An account with the email <${this.mail}> does not exist. Enter verification code to create a new account.`;
      this.use_password = false;
    }
  }

  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef>;

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (index == 5) {
      this.value[index] = input.value;
    }
    if (input.value.length == 1 && index < 5) {
      this.value[index] = input.value;
      this.codeInputs.get(index + 1)?.nativeElement.focus();
    }
  }

  onKeyPress(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && input.value === '' && index > 0) {
      this.codeInputs.get(index - 1)?.nativeElement.focus();
    }
  }

    onSubmit() {
    if (this.verifyForm.invalid) {
      this.code = '';
      this.show = true;
      setTimeout(() => (this.show = false), 3000);
      return;
    }

    this.loading = true;
    this.code = this.value.join('');

    this.authService.verify(this.token!, this.code).subscribe({
      next: (res) => {
        const { status, data } = res;
        if (status == 200) {
          this.cleanup();
          this.tokenService.storeToken(data);

          if (this.state == '1') {
            const role = this.tokenService.getUserRole(data);
            localStorage.removeItem('state');
            localStorage.removeItem('email');

            if (role == 'user') {
              this.router.navigate(['main-page'], { replaceUrl: true });
            } else if (role == 'admin') {
              this.router.navigate(['admin'], { replaceUrl: true });
            }
          } else {
            this.loading = false;
            this.modalOpen = true;
          }
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.code = '';
        this.show = true;
        setTimeout(() => (this.show = false), 3000);
      },
    });
  }

  onlyNumber(event: KeyboardEvent) {
    const allowedkeys = ['Enter', 'Backespace'];
    const charCode = event.key;
    if (!/^[0-9]$/.test(charCode) && !allowedkeys.includes(charCode)) {
      event.preventDefault();
    }
  }
  onclick() {
    if (this.state != '-1') {
      this.cleanup();
      this.router.navigate(['/auth/verify2'], { replaceUrl: true });
    }
  }
  onhover() {
    this.hover = true;
  }
  onout() {
    this.hover = false;
  }

  timer = setInterval(() => {
    if (!localStorage.getItem('time')) {
      localStorage.setItem('time', String(this.time));
    }
    let countDwon = parseInt(localStorage.getItem('time')!);
    const min = String(Math.trunc(countDwon / 60)).padStart(2, '0');
    const second = String(countDwon % 60).padStart(2, '0');
    countDwon -= 1;
    localStorage.setItem('time', String(countDwon));
    this.Labeltimer = `${min}:${second}`;
    if (countDwon == 0) {
      this.loading = false;
      this.Labeltimer = '00:00';
      this.cleanup();
      this.router.navigate(['/auth/login'], { replaceUrl: true });
    }
  }, 1000);

  cleanup() {
    localStorage.removeItem('time');
    clearInterval(this.timer);
  }
}
