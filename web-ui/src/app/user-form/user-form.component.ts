import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import validator from 'validator';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.styl']
})
export class UserFormComponent implements OnInit {

  @Output() onCancelEvent = new EventEmitter();
  @Input() userData = undefined;

  @ViewChild('userForm') public userForm: NgForm | undefined;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  submitForm(data: any) {
    if (validator.isEmpty(data.username) && validator.isEmpty(data.email)) {
      alert('Username and email is required');
      return
    }

    if (!validator.isEmail(data.email)) {
      alert('Email should be valid.');
      return
    }

    if (data.phone && !validator.isEmpty(data.phone) && !validator.isMobilePhone(data.phone, 'ms-MY')) {
      alert('Phone number should be valid');
      return
    }

    if (this.userData) {
      this.apiService.updateUser(Object.assign(this.userData, data))
        .pipe(
          catchError(err => {
            alert(err.error.error)
            return of()
          }),
        )
        .subscribe(_ => {
          alert('User has been updated.');
          this.userForm && this.userForm.reset();
          this.onCancelEvent.emit()
        });
    } else {
      this.apiService.createUser(data)
        .pipe(
          catchError(err => {
            alert(err.error.error)
            return of()
          }),
        )
        .subscribe(_ => {
          alert('User has been created.');
          this.userForm && this.userForm.reset();
          this.onCancelEvent.emit()
        });
    }
  }

  triggerCancel() {
    this.onCancelEvent.emit()
  }

}
