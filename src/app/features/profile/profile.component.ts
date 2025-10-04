// import { Post, User } from './../../shared/components/s-post/models/post';
// import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
// import { PostsService } from '../../shared/components/s-post/services/posts.service';
// import { ActivatedRoute } from '@angular/router';
// import { UserService } from '../auth/services/user.service';
// import { SPostComponent } from "../../shared/components/s-post/s-post.component";

// @Component({
//   selector: 'app-profile',
//   imports: [SPostComponent],
//   templateUrl: './profile.component.html',
//   styleUrl: './profile.component.css'
// })
// export class ProfileComponent {
//   private readonly userService = inject(UserService)
//   private readonly postsService = inject(PostsService)
  
//   userPosts: WritableSignal<Post[]> = signal([])

//   ngOnInit(): void {
//     this.getUserData()
//   }

//   id: string | null = null;


//   getUserData(): void {
//     this.userService.getLoggedUserData().subscribe({
//       next: (res) => {
//         console.log(res)
//         this.id = res.user._id
//         this.getUserPostsData()

//         console.log(this.id)
//       }
//       , error: (err) => { console.log(err) }
//     })
//   }

//   getUserPostsData(): void {
//     this.postsService.getUserPosts(this.id).subscribe({
//       next: (res) => {
//         console.log(res)
//         this.userPosts.set(res.posts)
//       }, error: (err) => { console.log(err) }
//     })
//   }
// }

import { Post, User } from './../../shared/components/s-post/models/post';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { PostsService } from '../../shared/components/s-post/services/posts.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../auth/services/user.service';
import { SPostComponent } from "../../shared/components/s-post/s-post.component";
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from "../../shared/components/create-post/create-post.component";

@Component({
  selector: 'app-profile',
  imports: [SPostComponent, CommonModule, CreatePostComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private readonly userService = inject(UserService)
  private readonly postsService = inject(PostsService)
  
  userPosts: WritableSignal<Post[]> = signal([])
  userData: WritableSignal<any> = signal(null) 
  isUploadingPhoto = signal(false)
  
  id: string | null = null;

  ngOnInit(): void {
    this.getUserData()
  }

  getUserData(): void {
    this.userService.getLoggedUserData().subscribe({
      next: (res) => {
        console.log(res)
        this.id = res.user._id
        this.userData.set(res.user)
        this.getUserPostsData()
        console.log(this.id)
      },
      error: (err) => { 
        console.log(err) 
      }
    })
  }

  getUserPostsData(): void {
    this.postsService.getUserPosts(this.id).subscribe({
      next: (res) => {
        console.log(res)
        this.userPosts.set(res.posts)
      }, 
      error: (err) => { 
        console.log(err) 
      }
    })
  }

  onPhotoSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Check file size (4MB max)
      if (file.size > 4 * 1024 * 1024) {
        alert('File size must be less than 4MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      this.uploadPhoto(file);
    }
  }

  uploadPhoto(file: File): void {
    this.isUploadingPhoto.set(true);
    
    this.userService.uploadProfilePhoto(file).subscribe({
      next: (response: any) => {
        console.log('Photo uploaded successfully', response);
        
        // Update the user data with new photo
        const currentUser = this.userData();
        if (currentUser) {
          currentUser.photo = response.user?.photo || response.photo;
          this.userData.set({...currentUser});
        }
        
        // Update localStorage if you're using it
        const localUserData = localStorage.getItem('user');
        if (localUserData) {
          const user = JSON.parse(localUserData);
          user.photo = response.user?.photo || response.photo;
          localStorage.setItem('user', JSON.stringify(user));
          
          // Dispatch event to update navbar
          window.dispatchEvent(new Event('storage'));
        }
        
        this.isUploadingPhoto.set(false);
        alert('Profile photo updated successfully!');
      },
      error: (err) => {
        console.error('Error uploading photo:', err);
        this.isUploadingPhoto.set(false);
        alert('Failed to upload photo. Please try again.');
      }
    });
  }
}
