import { Component } from '@angular/core';
import { ApiService, UserModel } from './api.service';
import * as queryString from 'query-string';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {
  title = 'etiqa-api';
  users: UserModel[] | undefined;
  totalPage: number | undefined;
  currentPage: number = 1;
  selectedUser: undefined;

  stateMachine: 'CREATE_USER' | 'UPDATE_USER' | 'USER_LIST' = 'USER_LIST';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadData();
  }

  showCreateUserForm() {
    this.stateMachine = 'CREATE_USER';
  }

  showUserList() {
    this.stateMachine = 'USER_LIST';
    this.loadData();
  }

  showUpdateForm(data: any) {
    this.selectedUser = data;
    this.stateMachine = 'UPDATE_USER';
  }

  deleteUser(userId: any) {
    this.apiService.deleteUser(userId)
      .subscribe(_ => {
        this.showUserList()
      });
  }

  loadData(page = 1): void {
    const parsed = queryString.parse(location.search) as any;
    this.currentPage = parsed.page || page;
    this.apiService.getUsers(this.currentPage)
      .subscribe(response => {
        this.users = response.results;
        this.totalPage = response.totalPage;
      });
  }
}
