import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export type GetAllUserRequests = {
  results: UserModel[]
  totalPage: number
}

export type UserModel = {
  username: string
  email: string
  phone: string
  hobby: string
  skillsets: string
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(page: number) {
    return this.http.get<GetAllUserRequests>(`${this.apiUrl}/user?page=${page}&itemPerPage=5`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createUser(data: any) {
    return this.http.post(`${this.apiUrl}/user`, data);
  }

  updateUser(data: any) {
    return this.http.put(`${this.apiUrl}/user/${data.id}`, data);
  }

  deleteUser(id: any) {
    return this.http.delete(`${this.apiUrl}/user/${id}`);
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
