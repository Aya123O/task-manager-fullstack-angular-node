import { SharedService } from './../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip'; // Add this
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  lang: string = 'en';
  direction: 'ltr' | 'rtl' = 'ltr';
  taskCount: number =0

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private sharedService: SharedService,
  ) {
    this.lang = this.translateService.currentLang;
  }
  ngOnInit(): void {
    this.sharedService.currentTaskCount.subscribe(count =>this.taskCount =count)
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
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
}
