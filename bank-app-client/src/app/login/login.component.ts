import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  errorMsg: string = '';
  successMsg: any = false;
  //login group
  loginForm = this.fb.group({
    //array
    acno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    pswd: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]*')]],
  });

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {}

  login() {
    if (this.loginForm.valid) {
      // alert('valid');
      let acno = this.loginForm.value.acno;
      let pswd = this.loginForm.value.pswd;

      //login api call
      this.api.login(acno, pswd).subscribe(
        (result: any) => {
          //success
          console.log(result);

          // alert(result.message);
          this.successMsg = true;
          // store username in localstorage
          localStorage.setItem('username', result.username);
          // store CurrentAcno in localstorage
          localStorage.setItem(
            'currentAcno',
            JSON.stringify(result.currentAcno)
          );
          // store token in localstorage
          localStorage.setItem('token', result.token);

          setTimeout(() => {
            // navigate dashboard
            this.router.navigateByUrl('dashboard');
          }, 2000);
        },
        // client error
        (result: any) => {
          this.errorMsg = result.error.message;
          setTimeout(() => {
            this.errorMsg = '';
            this.loginForm.reset();
          }, 3000);
        }
      );
    } else {
      alert('invalid inputs');
    }
  }

  ngOnInit(): void {}
}
