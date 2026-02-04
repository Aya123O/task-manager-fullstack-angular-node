// app/app.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './layout/navbar/navbar';
import { Auth } from './core/service/auth/auth';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BidiModule } from '@angular/cdk/bidi';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, TranslateModule, BidiModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  lang: string | null = null;
  direction = signal<'ltr' | 'rtl' | 'auto'>('ltr');


  constructor(
    public auth: Auth,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
      const dir = localStorage.getItem('dir');
      this.direction.set(dir === 'ltr' || dir === 'rtl' || dir === 'auto' ? dir : 'ltr');

    this.lang = localStorage.getItem('lang');
    this.translateService.setDefaultLang('en');
    this.translateService.use(this.lang || 'en');
  }
}
