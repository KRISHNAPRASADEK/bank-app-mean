import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import party from 'party-js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  //deposit form group
  depositForm = this.fb.group({
    //array
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]],
  });

  fundTransferForm = this.fb.group({
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    toAcno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    pswd: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]*')]],
  });

  isCollapse: boolean = true;
  user: string = '';
  currentAcno: Number = 0;
  balance: Number = 0;
  depositMsg: string = '';

  collapse() {
    this.isCollapse = !this.isCollapse;
  }
  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    if (localStorage.getItem('username')) {
      this.user = localStorage.getItem('username') || '';
    }
    if (localStorage.getItem('currentAcno')) {
      this.currentAcno = JSON.parse(localStorage.getItem('currentAcno') || '');
    }
  }

  deposit() {
    if (this.depositForm.valid) {
      let amount = this.depositForm.value.amount;
      this.currentAcno = JSON.parse(localStorage.getItem('currentAcno') || '');
      // api call returns observable
      this.api.deposit(this.currentAcno, amount).subscribe(
        // success case
        (result: any) => {
          console.log(result);
          this.depositMsg = result.message;
          setTimeout(() => {
            this.depositForm.reset();
            this.depositMsg = '';
          }, 5000);
        },
        // error msg
        (result: any) => {
          this.depositMsg = result.message;
        }
      );
    } else {
      alert('invalid Inputs');
    }
  }

  getBalance() {
    this.api.getBalance(this.currentAcno).subscribe((result: any) => {
      console.log(result);
      this.balance = result.balance;
    });
  }

  //showConfetti
  showConfetti(source: any) {
    party.confetti(source);
  }

  // transfer
  transfer() {}
}
