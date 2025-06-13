import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Theme, ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.scss']
})
export class HomeComponentComponent {
  theme$: Observable<Theme>;
  constructor(private themeService: ThemeService,private router: Router) {
    this.theme$ = this.themeService.theme$;
  }

  ngOnInit(): void {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  activeSection: string = 'home';
  manualScrolling: boolean = false;

  scrollToSection(id: string) {
    this.manualScrolling = true;
    this.activeSection = id;

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      this.manualScrolling = false;
    }, 800);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.manualScrolling) return; 

    const sections = ['home', 'about', 'contact'];
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
}
