import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.css'],
})
export class DeleteConfirmComponent implements OnInit {
  @Input() item: string | undefined;
  @Output() onCancel = new EventEmitter();
  @Output() onDelete = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  cancel() {
    // to occur user defined events -emit()
    this.onCancel.emit();
  }
  deleteAcc() {
    this.onDelete.emit(this.item);
  }
}
