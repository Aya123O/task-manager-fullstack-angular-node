import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip'; // Add this

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSlideToggleModule,
    TranslateModule,
    MatTooltipModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  lang: string = 'en';
  direction: 'ltr' | 'rtl' = 'ltr';
  constructor(
    private translateService: TranslateService,
    private router: Router,
  ) {
    this.lang = this.translateService.currentLang;
  }

  changelang() {
    if (this.lang === 'en') {
      localStorage.setItem('lang', 'ar');
      this.translateService.use('ar');
      this.lang = 'ar';
      this.direction = 'rtl';
      localStorage.setItem('dir', 'rtl');
    } else {
      localStorage.setItem('lang', 'en');
      this.translateService.use('en');
      this.lang = 'en';
      this.direction = 'ltr';
      localStorage.setItem('dir', 'ltr');
    }
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
