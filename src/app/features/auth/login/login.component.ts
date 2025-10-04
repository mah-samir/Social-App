import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InputComponent } from "../../../shared/components/input/input.component";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly userService = inject(UserService)
  private readonly router = inject(Router)
  private readonly cookieService = inject(CookieService)

  msgError: string = "";
  isLoading: boolean = false
  subscribtion:Subscription = new Subscription()

  loginForm: FormGroup = new FormGroup({

    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),

  })


  submit(): void {
    if (this.loginForm.valid) {

      this.subscribtion.unsubscribe()
      
      this.isLoading = true

      this.subscribtion=this.userService.signIn(this.loginForm.value).subscribe({
        next:(res) => {
          if (res.message === 'success') {
            this.msgError = '';
            setTimeout(() => {
              localStorage.setItem("token",res.token)
              this.router.navigate(['/timeline'])
            }, 2000);
          }
          this.isLoading = false
        }
        , error: (err) => {
          console.log(err)
          this.msgError = err.error.message
          this.isLoading = false
        }
      })
    }
  }
  
}
