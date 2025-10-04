import { Component, input, InputSignal, signal, inject } from '@angular/core';
import { Post } from './models/post';
import { DatePipe } from '@angular/common';
import { SCommentComponent } from "../s-comment/s-comment.component";
import { initFlowbite } from 'flowbite';
import { PostsService } from './services/posts.service';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../s-comment/services/comments.service';

@Component({
  selector: 'app-s-post',
  imports: [DatePipe, SCommentComponent, FormsModule],
  templateUrl: './s-post.component.html',
  styleUrl: './s-post.component.css'
})
export class SPostComponent {
  private readonly postsService = inject(PostsService);
  private readonly commentsService = inject(CommentsService);
  
  post: InputSignal<Post> = input.required();
  liked = signal(false);
  showComments = signal(false);
  isDropdownOpen = signal(false);

  // Comment properties
  commentContent = signal('');
  isSubmitting = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    initFlowbite();
  }

  toggleComments() {
    this.showComments.set(!this.showComments());
    // Clear any previous errors when toggling
    if (!this.showComments()) {
      this.errorMessage.set('');
      this.commentContent.set('');
    }
  }

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  openEditModal() {
    this.isDropdownOpen.set(false);
    // Dispatch custom event with post data
    window.dispatchEvent(new CustomEvent('editPost', { detail: this.post() }));
  }

  deletePost() {
    this.isDropdownOpen.set(false);

    // Optional: Show confirmation dialog
    if (confirm('Are you sure you want to delete this post?')) {
      this.postsService.deletePost(this.post()._id).subscribe({
        next: (res) => {
          console.log('Post deleted successfully', res);
          // Dispatch event to refresh posts list
          window.dispatchEvent(new CustomEvent('postDeleted'));
        },
        error: (err) => {
          console.error('Error deleting post', err);
        }
      });
    }
  }

  likePost() {
    this.liked.set(!this.liked());
  }

  sharePost() {
    console.log("Post shared!");
  }

  submitComment() {
    const content = this.commentContent().trim();
    
    if (!content) {
      this.errorMessage.set('Please enter a comment');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.commentsService.createComment(content, this.post()._id).subscribe({
      next: (response) => {
        console.log('Comment added successfully', response);
        
        // Update the comments list with the new comments from response
        if (response.comments) {
          this.post().comments = response.comments;
        }
        
        this.isSubmitting.set(false);
        this.commentContent.set('');
        
        // Keep comments section open
        this.showComments.set(true);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Failed to add comment. Please try again.');
        console.error('Error adding comment:', error);
      }
    });
  }

  // Handle comment update from child component
  onCommentUpdated(response: any) {
    console.log('Comment updated in post', response);
    // Optionally refresh comments if needed
  }

  // Handle comment deletion from child component
  onCommentDeleted(commentId: string) {
    // Remove the deleted comment from the list
    this.post().comments = this.post().comments.filter((c: any) => c._id !== commentId);
    console.log('Comment deleted from post', commentId);
  }
}