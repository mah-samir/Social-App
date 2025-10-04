// import { Component, ElementRef, inject, signal, viewChild, WritableSignal } from '@angular/core';
// import { initFlowbite, Modal } from 'flowbite';
// import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms"
// import { PostsService } from '../s-post/services/posts.service';
// @Component({
//   selector: 'app-create-post',
//   imports: [ReactiveFormsModule],
//   templateUrl: './create-post.component.html',
//   styleUrl: './create-post.component.css'
// })
// export class CreatePostComponent {

//   private readonly postsService = inject(PostsService)

//   saveFile: WritableSignal<File | null> = signal(null)
//   content: FormControl = new FormControl(null, [Validators.required])

//   myModal = viewChild<ElementRef>('Modal')

//   ngOnInit(): void {
//     initFlowbite();
//   }


//   changeImage(e: Event): void {
//     let input = e.target as HTMLInputElement
//     if (input.files && input.files.length > 0) {
//       console.log(input.files[0])
//       this.saveFile.set(input.files[0])
//     }
//   }


//   submitForm(e: Event): void {
//     e.preventDefault()
//     const formData = new FormData();
//     let file = this.saveFile()

//     if (this.content.valid) {
//       console.log(this.content.value)
//     }

//     formData.append('body', this.content.value as string)
//     if (file) {
//       formData.append('image', file, file.name)
//     }
//     this.postsService.createPost(formData).subscribe(
//       {
//         next: (res) => {
//           console.log(res)
//           new Modal(this.myModal()?.nativeElement).hide()
//         },
//         error: (err) => {
//           console.log(err)
//         }
//       }
//     )
//   }
// }
import { Component, ElementRef, inject, signal, viewChild, WritableSignal, effect } from '@angular/core';
import { initFlowbite, Modal } from 'flowbite';
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms"
import { PostsService } from '../s-post/services/posts.service';
import { UserService } from '../../../features/auth/services/user.service';

@Component({
  selector: 'app-create-post',
  imports: [ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent {

  private readonly postsService = inject(PostsService)
  private readonly userService = inject(UserService)

  saveFile: WritableSignal<File | null> = signal(null)
  content: FormControl = new FormControl(null, [Validators.required])

  myModal = viewChild<ElementRef>('Modal')

  // For edit mode
  editMode = signal(false);
  postToEdit = signal<any>(null);

  constructor() {
    // Listen for custom event to edit post
    window.addEventListener('editPost', ((event: CustomEvent) => {
      this.openEditMode(event.detail);
    }) as EventListener);
  }

  ngOnInit(): void {
    initFlowbite();
    this.getUserData()

  }


  u_name: string = '';


  getUserData(): void {
    this.userService.getLoggedUserData().subscribe({
      next: (res) => {
        console.log(res)
        this.u_name = res.user.name

        console.log(this.u_name)
      }
      , error: (err) => { console.log(err) }
    })
  }


  openEditMode(post: any) {
    this.editMode.set(true);
    this.postToEdit.set(post);
    this.content.setValue(post.body);

    // Open modal
    const modal = new Modal(this.myModal()?.nativeElement);
    modal.show();
  }

  changeImage(e: Event): void {
    let input = e.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      console.log(input.files[0])
      this.saveFile.set(input.files[0])
    }
  }

  submitForm(e: Event): void {
    e.preventDefault()
    const formData = new FormData();
    let file = this.saveFile()

    if (!this.content.valid) {
      return;
    }

    formData.append('body', this.content.value as string)
    if (file) {
      formData.append('image', file, file.name)
    }

    // Check if we're in edit mode
    if (this.editMode() && this.postToEdit()) {
      this.updatePost(formData);
    } else {
      this.createPost(formData);
    }
  }

  createPost(formData: FormData): void {
    this.postsService.createPost(formData).subscribe({
      next: (res) => {
        console.log('Post created', res)
        this.closeModal();
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  updatePost(formData: FormData): void {
    const postId = this.postToEdit()._id;
    this.postsService.updatePost(postId, formData).subscribe({
      next: (res) => {
        console.log('Post updated', res)
        this.closeModal();
        // Dispatch event to refresh posts
        window.dispatchEvent(new CustomEvent('postUpdated'));
      },
      error: (err) => {
        console.log(err)
      }
    });
  }


  closeModal(): void {
    new Modal(this.myModal()?.nativeElement).hide();
    this.resetForm();
  }

  resetForm(): void {
    this.content.reset();
    this.saveFile.set(null);
    this.editMode.set(false);
    this.postToEdit.set(null);
  }
}