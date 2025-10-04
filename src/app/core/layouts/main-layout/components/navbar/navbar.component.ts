// import { Component, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
// import { ActivatedRoute, RouterLink } from '@angular/router';
// import { initFlowbite } from 'flowbite';
// import { Post } from '../../../../../shared/components/s-post/models/post';
// import { UserService } from '../../../../../features/auth/services/user.service';

// @Component({
//   selector: 'app-navbar',
//   imports: [RouterLink],
//   templateUrl: './navbar.component.html',
//   styleUrl: './navbar.component.css'
// })
// export class NavbarComponent {

//   private readonly activatedRoute = inject(ActivatedRoute)
//     private readonly userService = inject(UserService)
  

//   ngOnInit(): void {
//     initFlowbite();
//     this.getUserData()

//   }


//   u_name: string = '';
//   uEmail:string=''

//   getUserData(): void {
//     this.userService.getLoggedUserData().subscribe({
//       next: (res) => {
//         console.log(res)
//         this.u_name = res.user.name
//         this.uEmail=res.user.email
//         console.log(this.u_name)
//       }
//       , error: (err) => { console.log(err) }
//     })
//   }

// }
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { UserService } from '../../../../../features/auth/services/user.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly userService = inject(UserService);

  u_name: string = '';
  uEmail: string = '';
  userPhoto: string = '/images/profile.png'; // default photo

  ngOnInit(): void {
    initFlowbite();
    this.getUserData();

    // listen to "storage" event when photo updated in Profile
    window.addEventListener('storage', () => {
      this.loadPhotoFromLocal();
    });
  }

  getUserData(): void {
    this.userService.getLoggedUserData().subscribe({
      next: (res) => {
        console.log(res);
        this.u_name = res.user.name;
        this.uEmail = res.user.email;
        this.userPhoto = res.user.photo || '/images/profile.png';

        // save to localStorage for sync with profile
        const user = {
          name: this.u_name,
          email: this.uEmail,
          photo: this.userPhoto
        };
        localStorage.setItem('user', JSON.stringify(user));
      },
      error: (err) => { console.log(err); }
    });
  }

  loadPhotoFromLocal(): void {
    const localUserData = localStorage.getItem('user');
    if (localUserData) {
      const user = JSON.parse(localUserData);
      this.userPhoto = user.photo || '/images/profile.png';
    }
  }

  signOut():void{
    this.userService.logOut()
  }
}




  

