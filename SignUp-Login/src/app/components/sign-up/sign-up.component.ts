import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../../service/login-service.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  providers: [LoginServiceService],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit{
  constructor (private ls:LoginServiceService, private fb: FormBuilder,private router:Router ){}
  ngOnInit(): void {
    // console.log(this.registerForm.value);
  }
  registerForm=this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
    userName: ['',Validators. required],
    password: ['',Validators.required]
  })

  postUser(userData: any): void {
    this.ls.signup(userData).subscribe({
      next: res => alert(res.message),
      error: err => alert(err.error.message)
    });
    this. registerForm. reset()
    this.router.navigate(["/login"])
  }

  }


