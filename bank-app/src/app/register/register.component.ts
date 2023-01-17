import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  //register form group
  registerForm = this.fb.group({
    //array
    uname: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    acno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    pswd: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]*')]],
  });

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  register() {
    if (this.registerForm.valid) {
      let acno = this.registerForm.value.acno;
      let pswd = this.registerForm.value.pswd;
      let uname = this.registerForm.value.uname;
      this.api.register(uname, acno, pswd).subscribe(
        (result: any) => {
          //success
          alert(result.message);
          this.router.navigateByUrl('');
        },
        // client error
        (result: any) => {
          alert(result.error.message);
        }
      );
    } else {
      alert('invalid Input');
    }
  }
}
