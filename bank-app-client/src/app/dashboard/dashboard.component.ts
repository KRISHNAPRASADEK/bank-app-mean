import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import party from 'party-js';
import { Router } from '@angular/router';

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
  fundTransferSuccessMsg: string = '';
  fundTransferErrorMsg: string = '';
  logoutDiv: boolean = false;
  deleteSpinnerDiv: boolean = false;
  acno: any = '';
  deleteConfirm: boolean = false;

  collapse() {
    this.isCollapse = !this.isCollapse;
  }
  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      alert('Please Login!');
      this.router.navigateByUrl('');
    }

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
          this.depositMsg = result.error.message;
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
  transfer() {
    if (this.fundTransferForm.valid) {
      let toAcno = this.fundTransferForm.value.toAcno;
      let pswd = this.fundTransferForm.value.pswd;
      let amount = this.fundTransferForm.value.amount;
      // make api call for fund transfer
      this.api.fundTransfer(toAcno, pswd, amount).subscribe(
        //success
        (result: any) => {
          this.fundTransferSuccessMsg = result.message;
          setTimeout(() => {
            this.fundTransferSuccessMsg = '';
          }, 3000);
        },
        //error
        (result: any) => {
          this.fundTransferErrorMsg = result.error.message;
          setTimeout(() => {
            this.fundTransferErrorMsg = '';
          }, 3000);
        }
      );
    } else {
      alert('Invalid Form');
    }
  }

  // clear fund transfer form
  clearFundTransferForm() {
    this.fundTransferErrorMsg = '';
    this.fundTransferSuccessMsg = '';
    this.fundTransferForm.reset();
  }

  logout() {
    localStorage.clear();
    this.logoutDiv = true;
    setTimeout(() => {
      this.router.navigateByUrl('');
      this.logoutDiv = false;
    }, 4000);
  }

  deleteAccountFromNavbar() {
    this.acno = localStorage.getItem('currentAcno');
    this.deleteConfirm = true;
  }

  onCancel() {
    this.acno = '';
    this.deleteConfirm = false;
  }
  onDelete(event: any) {
    let deleteAcno = JSON.parse(event);
    this.api.deleteAccount(deleteAcno).subscribe(
      (result: any) => {
        localStorage.clear();
        this.deleteSpinnerDiv = true;
        setTimeout(() => {
          this.router.navigateByUrl('');
          this.deleteSpinnerDiv = false;
        }, 3000);
      },
      (result: any) => {
        alert(result.error.message);
      }
    );
  }
}
