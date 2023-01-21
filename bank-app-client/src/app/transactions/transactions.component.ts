import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  allTransactions: any;
  searchKey:string='';
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAllTransactions().subscribe((result: any) => {
      console.log(result);
      this.allTransactions = result.transaction;
      console.log(this.allTransactions);
    });
  }

  search(event: any) {
    this.searchKey = event.target.value;
  }
}
