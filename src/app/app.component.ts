import { Router } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';




@Component({
  selector: 'shakti-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  constructor(private authService: AuthService,private locationService: LocationService,private router:Router) { }
  ngOnInit() {
    this.authService.autoLogin();
  }
}
