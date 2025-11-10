import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PLATFORM_ID } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { Theme, ThemeService } from '../../core/services/theme.service';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main-navbar',
  standalone: true,
  imports: [TranslateModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './main-navbar.component.html',
  styleUrl: './main-navbar.component.scss'
})
export class MainNavbarComponent implements OnInit {
  theme$: Observable<Theme>;

  constructor(
    public translate: TranslateService,
    private themeService: ThemeService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.theme$ = this.themeService.theme$;
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.initLanguage();
  }

  isBrowser: boolean;
  showLangDropdown = false;
  currentLang: string = 'en';

  @ViewChild('navbarCollapse') navbarCollapse!: ElementRef;

  initLanguage() {
    let lang = 'en';

    if (this.isBrowser) {
      lang = localStorage.getItem('app_lang') || 'en';
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }

    this.currentLang = lang;
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
    this.translate.use(lang);
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: any) {
    if (!event.target.closest('.lang-dropdown-trigger')) {
      this.showLangDropdown = false;
    }
  }

  toggleLang() {
    const newLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.switchLang(newLang);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;

    if (this.isBrowser) {
      localStorage.setItem('app_lang', lang);
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }

  currentRoute = '';
  isPatientsActive = false;

  ngOnInit(): void {
    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
        this.isPatientsActive = this.currentRoute.includes('/dashboard/patients');
        const collapseElement = document.getElementById('navbarText');
        if (collapseElement?.classList.contains('show') && window.innerWidth < 992) {
          const navbarToggler = document.querySelector('.navbar-toggler') as HTMLElement;
          navbarToggler?.click();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }
}
