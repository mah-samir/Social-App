import { routes } from './../../../app.routes';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from "../../../shared/components/input/input.component";
import { subscribeOn, Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private readonly userService = inject(UserService)
  private readonly router = inject(Router)
  subscribtion: Subscription = new Subscription


  msgError: string = "";
  isLoading: boolean = false
  flag: boolean = true

  registerForm: FormGroup = new FormGroup({

    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(24)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
    rePassword: new FormControl(null, [Validators.required]),
    dateOfBirth: new FormControl(null, [Validators.required]),
    gender: new FormControl(null, [Validators.required]),

  },{ validators: this.confirmPassword })

  confirmPassword(group: AbstractControl) {
    if (group.get("password")?.value === group.get("rePassword")?.value)
      return null
    else
      group.get('rePassword')?.setErrors({ mismatch: true })
    return { mismatch: true }
  };



  submit(): void {
    if (this.registerForm.valid) {
      this.subscribtion.unsubscribe()
      this.isLoading = true
      this.subscribtion = this.userService.signUp(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res)
          if (res.message === 'success') {
            this.msgError = '';
            setTimeout(() => {
              this.router.navigate(['/login'])
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
    else {
      this.registerForm.get('rePassword')?.patchValue('@')
      this.registerForm.markAllAsTouched()
    }
  }

}
