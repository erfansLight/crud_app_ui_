import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  imports: [MatIconModule,CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  categories = [
    {
      title: 'test',
      items: ['test1', 'test2', 'test3']
    },
    {
      title: 'test',
      items: ['test1', 'test2', 'test3']
    },
    {
      title: 'test',
      items: ['test1', 'test2', 'test3']
    }
  ];

    socialMedias = [
    { name: 'Facebook', icon: 'social/facebook.svg', url: 'https://www.facebook.com/' },
    { name: 'Twitter', icon: 'social/x.svg', url: 'https://x.com/' },
    { name: 'Instagram', icon: 'social/instagram.svg', url: 'https://www.instagram.com/' },
    { name: 'Telegram', icon: 'social/telegram.svg', url: 'https://telegram.org/' },
    { name: 'github', icon: 'social/github.svg', url: 'https://github.com/erfansLight' },
    { name: 'youtube', icon: 'social/youtubekids.svg', url: 'https://www.youtube.com/' },
    { name: 'aparat', icon: 'social/aparat.svg', url: 'https://aparat.com' },
  ];

}
