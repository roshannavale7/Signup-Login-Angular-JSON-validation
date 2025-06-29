import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoginServiceService } from '../../service/login-service.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  loggedIn: boolean = false;
  userName: string = '';

  constructor(
    private ls: LoginServiceService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  this.ls.loggedIn$.subscribe((status) => {
    this.loggedIn = status;
    this.cd.detectChanges();
  });

  this.ls.userName$.subscribe((name) => {
    this.userName = name;
    this.cd.detectChanges();
  });
}


  logout() {
    this.ls.logout();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate(['/dashboard']);    
    window.location.reload();
});

  }
}
