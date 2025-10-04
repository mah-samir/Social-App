import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly httpClient = inject(HttpClient)
  private readonly router = inject(Router)

  signUp(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `users/signup`, data)
  }

  signIn(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `users/signin`, data)
  }

  changePassword(data: object): Observable<any> {
    return this.httpClient.patch(environment.baseUrl + `users/change-password`, data)
  }


  getLoggedUserData(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `users/profile-data`)
  }

  uploadProfilePhoto(photo: File) {
    const formData = new FormData();
    formData.append('photo', photo);

    return this.httpClient.put(
      environment.baseUrl + 'users/upload-photo',
      formData
    );
  }


  logOut(): void {
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  }
}
