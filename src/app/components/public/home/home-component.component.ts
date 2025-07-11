import { Component, HostListener, Inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { Theme, ThemeService } from '../../core/services/theme.service';
import { PricingComponent } from '../pricing/pricing.component';


@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [TranslateModule, CommonModule , PricingComponent],
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.scss']
})
export class HomeComponentComponent {
  theme$: Observable<Theme>;
  constructor(private themeService: ThemeService ,  public translate: TranslateService,
    private router: Router,
  @Inject(PLATFORM_ID) private platformId: Object) {
    this.theme$ = this.themeService.theme$;
     this.isBrowser = isPlatformBrowser(this.platformId);
  this.initLanguage();
  }
 

  ngOnInit(): void {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  activeSection: string = 'home';
  manualScrolling: boolean = false;
  isBrowser: boolean;
showLangDropdown = false;

  currentLang: string = 'en';



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

switchLang(lang: string) {
  this.translate.use(lang);
  this.currentLang = lang;

  if (this.isBrowser) {
    localStorage.setItem('app_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
}


  scrollToSection(id: string) {
    this.manualScrolling = true;
    this.activeSection = id;
    const el = this.isBrowser ? document.getElementById(id) : null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      this.manualScrolling = false;
    }, 800);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isBrowser) return;
    if (this.manualScrolling) return;

    const sections = ['home', 'about', 'contact' , 'pricing'];
    for (let section of sections) {
      const el = document.getElementById(section);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom >= 80) {
          this.activeSection = section;
          break;
        }
      }
    }
  }

  navigateToLogin(){
    console.log('safy')
    this.router.navigate(['/login']);
  }
}
