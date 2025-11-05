import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TokenService } from '../../shared/services/token.service';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  userName: string | null = null;

  private tokenService: TokenService = inject(TokenService);

  labels = [
    { name: 'test1', icon: 'smartphone' },
    { name: 'test2', icon: 'computer' },
    { name: 'test3', icon: 'headphones' },
    { name: 'test4', icon: 'keyboard_alt' },
  ];

  ngOnInit(): void {
    const user = this.tokenService.getUserInfo();
    if (
      user &&
      !this.tokenService.isTokenExpired(this.tokenService.getToken()!)
    ) {
      this.userName = user.name;
    }
  }

  logout(): void {
    this.tokenService.clearToken();
    this.userName = null;
  }
}
