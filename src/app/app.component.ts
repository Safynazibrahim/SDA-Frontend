import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./components/auth/login/login.component";
import { RegisterComponent } from "./components/auth/register/register.component";
import { ForgetPassComponent } from "./components/auth/forget-pass/forget-pass.component";
import { LoaderService } from './components/core/services/loader.service';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
console.log('Environment:', environment);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SDA';
  constructor(public loader: LoaderService) {}
}